
import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { 
  ArrowRight,
  ChevronDown, 
  ChevronUp, 
  Coins, 
  DollarSign, 
  Info, 
  LineChart, 
  PiggyBank, 
  Shield, 
  TrendingUp
} from "lucide-react";
import { Link } from "react-router-dom";

// Mock investment options for demonstration
const mockInvestments = [
  {
    id: "inv1",
    name: "Index Mutual Funds",
    description: "Low-cost funds that track market indices like Nifty 50.",
    returnRange: "10-12%",
    risk: "medium",
    minimumAmount: 1000,
    timeHorizon: "3+ years",
    best_for: ["Long-term goals", "Beginners", "Passive investors"],
    features: [
      "Low expense ratios",
      "Diversified portfolio",
      "No fund manager bias"
    ]
  },
  {
    id: "inv2",
    name: "Recurring Deposits",
    description: "Fixed monthly deposits that earn interest from banks.",
    returnRange: "5-6%",
    risk: "very low",
    minimumAmount: 500,
    timeHorizon: "6 months - 10 years",
    best_for: ["Short-term goals", "Conservative investors", "Emergency funds"],
    features: [
      "Fixed returns",
      "Guaranteed by banks",
      "Flexible tenures"
    ]
  },
  {
    id: "inv3",
    name: "Gold Bonds",
    description: "Government securities denominated in grams of gold.",
    returnRange: "7-8%",
    risk: "low",
    minimumAmount: 5000,
    timeHorizon: "5-8 years",
    best_for: ["Inflation protection", "Portfolio diversification"],
    features: [
      "Interest income + gold price appreciation",
      "Government backed",
      "No storage concerns"
    ]
  },
  {
    id: "inv4",
    name: "Large Cap Mutual Funds",
    description: "Funds investing in established companies with large market capitalization.",
    returnRange: "12-15%",
    risk: "medium-high",
    minimumAmount: 1000,
    timeHorizon: "5+ years",
    best_for: ["Long-term wealth creation", "Growth with stability"],
    features: [
      "Professional management",
      "Better liquidity",
      "Regulated by SEBI"
    ]
  }
];

// Mock risk preferences
const riskOptions = [
  { label: "Conservative", value: "low", description: "Preserving capital is my priority" },
  { label: "Moderate", value: "medium", description: "Balance between growth and stability" },
  { label: "Aggressive", value: "high", description: "Maximizing long-term growth" },
];

// Mock investment timelines
const timelineOptions = [
  { label: "Short-term", value: "short", description: "Less than 1 year" },
  { label: "Mid-term", value: "medium", description: "1-5 years" },
  { label: "Long-term", value: "long", description: "More than 5 years" },
];

const InvestmentSuggestions = () => {
  const { toast } = useToast();
  const [investments] = useState(mockInvestments);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [riskPreference, setRiskPreference] = useState("medium");
  const [timeline, setTimeline] = useState("medium");

  // Toggle expanded state for investment cards
  const toggleExpand = (id: string) => {
    if (expandedId === id) {
      setExpandedId(null);
    } else {
      setExpandedId(id);
    }
  };

  // Function to handle investment selection
  const handleSelect = (investment: any) => {
    toast({
      title: `${investment.name} selected`,
      description: "Added to your portfolio for consideration.",
    });
  };

  // Function to get risk class for styling
  const getRiskClass = (risk: string) => {
    switch (risk) {
      case "very low":
        return "bg-green-100 text-green-800";
      case "low":
        return "bg-blue-100 text-blue-800";
      case "medium":
        return "bg-amber-100 text-amber-800";
      case "medium-high":
      case "high":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Investment Suggestions</h1>
        <p className="text-muted-foreground">
          Personalized investment options to help you reach your goals
        </p>
      </div>

      {/* Risk & Timeline Selector */}
      <Card>
        <CardHeader>
          <CardTitle>Customize Recommendations</CardTitle>
          <CardDescription>
            Tell us your preferences to receive tailored investment options
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-medium mb-3">Risk Preference</h3>
              <div className="space-y-2">
                {riskOptions.map(option => (
                  <div 
                    key={option.value}
                    onClick={() => setRiskPreference(option.value)}
                    className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                      riskPreference === option.value 
                        ? "border-primary bg-primary/5" 
                        : "border-border hover:border-primary/50"
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      <div className={`w-4 h-4 rounded-full ${
                        riskPreference === option.value
                          ? "bg-primary" 
                          : "bg-muted"
                      }`}></div>
                      <span className="font-medium">{option.label}</span>
                    </div>
                    <p className="text-xs text-muted-foreground pl-6 mt-1">{option.description}</p>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h3 className="font-medium mb-3">Investment Timeline</h3>
              <div className="space-y-2">
                {timelineOptions.map(option => (
                  <div 
                    key={option.value}
                    onClick={() => setTimeline(option.value)}
                    className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                      timeline === option.value 
                        ? "border-primary bg-primary/5" 
                        : "border-border hover:border-primary/50"
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      <div className={`w-4 h-4 rounded-full ${
                        timeline === option.value
                          ? "bg-primary" 
                          : "bg-muted"
                      }`}></div>
                      <span className="font-medium">{option.label}</span>
                    </div>
                    <p className="text-xs text-muted-foreground pl-6 mt-1">{option.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Investment Options */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">Recommended Investments</h2>
          <Button variant="ghost" size="sm" className="text-primary">
            <Info className="h-4 w-4 mr-1" /> How these work
          </Button>
        </div>
        
        <div className="space-y-4">
          {investments.map((investment) => (
            <Card key={investment.id} className="overflow-hidden">
              <div className="flex flex-col md:flex-row">
                <div className="md:w-1/6 bg-accent/20 flex items-center justify-center p-4">
                  {investment.id === "inv1" && <LineChart className="h-10 w-10 text-accent-foreground" />}
                  {investment.id === "inv2" && <PiggyBank className="h-10 w-10 text-accent-foreground" />}
                  {investment.id === "inv3" && <Coins className="h-10 w-10 text-accent-foreground" />}
                  {investment.id === "inv4" && <TrendingUp className="h-10 w-10 text-accent-foreground" />}
                </div>
                <div className="flex-1 p-4">
                  <div className="flex flex-col md:flex-row md:items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-lg">{investment.name}</h3>
                      <p className="text-muted-foreground text-sm">{investment.description}</p>
                    </div>
                    <div className="md:text-right mt-2 md:mt-0">
                      <Badge variant="outline" className="mb-1">Min: ₹{investment.minimumAmount}</Badge>
                      <div className="flex items-center md:justify-end">
                        <span className="text-sm font-medium text-muted-foreground mr-2">Risk:</span>
                        <Badge className={getRiskClass(investment.risk)}>{investment.risk}</Badge>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-col md:flex-row md:items-center justify-between mt-4">
                    <div className="flex items-center">
                      <LineChart className="h-4 w-4 mr-1 text-muted-foreground" />
                      <span className="text-sm">Expected Returns: <span className="font-medium">{investment.returnRange}</span></span>
                    </div>
                    <div className="flex items-center mt-2 md:mt-0">
                      <Shield className="h-4 w-4 mr-1 text-muted-foreground" />
                      <span className="text-sm">Time Horizon: <span className="font-medium">{investment.timeHorizon}</span></span>
                    </div>
                  </div>
                  
                  {expandedId === investment.id && (
                    <div className="mt-4 pt-4 border-t">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <h4 className="font-medium text-sm mb-2">Best For:</h4>
                          <ul className="text-sm space-y-1">
                            {investment.best_for.map((item, i) => (
                              <li key={i} className="flex items-center">
                                <span className="bg-green-100 text-green-800 rounded-full p-0.5 mr-2">
                                  <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                                    <path d="M8 3L4 7L2 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                  </svg>
                                </span>
                                {item}
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <h4 className="font-medium text-sm mb-2">Key Features:</h4>
                          <ul className="text-sm space-y-1">
                            {investment.features.map((feature, i) => (
                              <li key={i} className="flex items-center">
                                <span className="bg-blue-100 text-blue-800 rounded-full p-0.5 mr-2">
                                  <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                                    <path d="M8 3L4 7L2 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                  </svg>
                                </span>
                                {feature}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <CardFooter className="flex items-center justify-between bg-muted/30 px-4 py-2">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => toggleExpand(investment.id)}
                  className="text-muted-foreground"
                >
                  {expandedId === investment.id ? (
                    <>
                      <ChevronUp className="h-4 w-4 mr-1" /> Less Details
                    </>
                  ) : (
                    <>
                      <ChevronDown className="h-4 w-4 mr-1" /> More Details
                    </>
                  )}
                </Button>
                <div className="space-x-2">
                  <Button variant="outline" size="sm">
                    <Info className="h-4 w-4 mr-1" /> Learn More
                  </Button>
                  <Button size="sm" onClick={() => handleSelect(investment)}>
                    <DollarSign className="h-4 w-4 mr-1" /> Add to Plan
                  </Button>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
        
        <div className="mt-6 flex items-center justify-between p-4 bg-accent/10 rounded-lg">
          <div>
            <h3 className="font-medium">Need more personalized guidance?</h3>
            <p className="text-sm text-muted-foreground">Get tailored investment advice from our AI advisor</p>
          </div>
          <Button>
            Get Custom Plan <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default InvestmentSuggestions;
