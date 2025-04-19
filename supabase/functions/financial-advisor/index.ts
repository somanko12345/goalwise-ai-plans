
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

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
    // This is a simplified assumption - in a real app we'd use actual income data
    const estimatedMonthlyIncome = 50000; // Placeholder assumption
    const isGoalFeasible = monthlyContribution < (estimatedMonthlyIncome * 0.5);
    
    // Basic calculations to send to the AI
    const calculationSummary = {
      monthsLeft,
      amountNeeded,
      monthlyContribution,
      isGoalFeasible
    };

    console.log("Sending to OpenAI:", { goalData, calculationSummary });
    
    // Generate AI advice based on goal and calculations
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { 
            role: 'system', 
            content: `You are a financial advisor specializing in personal finance and savings goals. 
                     Provide practical, actionable advice to help users achieve their financial goals.
                     Be concise and friendly. Structure your response in these sections:
                     1. Goal Summary (1 sentence)
                     2. Feasibility Analysis (1-2 sentences)
                     3. Monthly Plan (1-2 sentences) 
                     4. 3 Practical Tips (bullet points)
                     Keep your total response under 250 words.` 
          },
          { 
            role: 'user', 
            content: `Please analyze this financial goal and provide advice:
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
                     Goal appears feasible: ${calculationSummary.isGoalFeasible ? "Yes" : "No"}`
          }
        ],
        temperature: 0.7,
        max_tokens: 500,
      }),
    });

    const data = await response.json();
    console.log("OpenAI response received");
    
    if (!data.choices || !data.choices[0]) {
      console.error("Unexpected response from OpenAI:", data);
      throw new Error("Invalid response from OpenAI");
    }
    
    const advice = data.choices[0].message.content;

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
