
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const cohereApiKey = Deno.env.get('COHERE_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { goalData } = await req.json();
    
    // Calculate months between now and timeline
    const timelineDate = new Date(goalData.timeline);
    const currentDate = new Date();
    const monthsLeft = (timelineDate.getFullYear() - currentDate.getFullYear()) * 12 + 
                        (timelineDate.getMonth() - currentDate.getMonth());
    
    // Calculate required monthly savings
    const amountNeeded = goalData.target - goalData.current_amount;
    const monthlyContribution = monthsLeft > 0 ? amountNeeded / monthsLeft : Infinity;
    
    // Determine if goal is feasible (less than 50% of estimated monthly income)
    const estimatedMonthlyIncome = 50000; // Placeholder assumption
    const isGoalFeasible = monthlyContribution < (estimatedMonthlyIncome * 0.5);
    
    // Basic calculations to send to the AI
    const calculationSummary = {
      monthsLeft,
      amountNeeded,
      monthlyContribution,
      isGoalFeasible
    };

    console.log("Sending to Cohere:", { goalData, calculationSummary });
    
    // Generate AI advice using Cohere
    const response = await fetch('https://api.cohere.ai/v1/chat', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${cohereApiKey}`,
        'Content-Type': 'application/json',
        'Cohere-Version': '2022-12-06'
      },
      body: JSON.stringify({
        model: 'command-r',
        message: `Please analyze this financial goal and provide advice:
                 Goal: ${goalData.name} 
                 Category: ${goalData.category}
                 Target amount: ₹${goalData.target}
                 Current savings: ₹${goalData.current_amount}
                 Timeline: ${new Date(goalData.timeline).toLocaleDateString()}
                 Description: ${goalData.description || "No description provided"}
                 
                 Additional calculations:
                 Months remaining: ${calculationSummary.monthsLeft}
                 Amount still needed: ₹${calculationSummary.amountNeeded} 
                 Required monthly contribution: ₹${calculationSummary.monthlyContribution.toFixed(2)}
                 Goal appears feasible: ${calculationSummary.isGoalFeasible ? "Yes" : "No"}`,
        preamble: `You are a financial advisor specializing in personal finance and savings goals. 
                  Provide practical, actionable advice to help users achieve their financial goals.
                  Be concise and friendly. Structure your response in these sections:
                  1. Goal Summary (1 sentence)
                  2. Feasibility Analysis (1-2 sentences)
                  3. Monthly Plan (1-2 sentences) 
                  4. 3 Practical Tips (bullet points)
                  Keep your total response under 250 words.`,
        temperature: 0.7,
        max_tokens: 500,
      }),
    });

    const data = await response.json();
    console.log("Cohere response received");
    
    if (!data.text) {
      console.error("Unexpected response from Cohere:", data);
      throw new Error("Invalid response from Cohere");
    }
    
    const advice = data.text;

    return new Response(JSON.stringify({ 
      advice,
      calculations: calculationSummary
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
    
  } catch (error) {
    console.error('Error in financial-advisor function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
