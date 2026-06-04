import { useEffect } from "react";
import { motion } from "framer-motion";
import { useIntelligence } from "../../hooks/useIntelligence";
import { useProjectStore } from "../../store/projectStore";
import { Button } from "../../components/ui/button";
import { Card } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import {
  Loader2,
  Sparkles,
  RefreshCw,
  TrendingUpIcon,
  Zap,
  Briefcase,
  BarChart3,
  CheckCircle2,
  Target,
} from "lucide-react";
import type { Trend, CompetitiveMove } from "../../types/intelligence";

export default function Intelligence() {
  const { activeProject } = useProjectStore();
  const { digest, loading, fetchDigest, refreshDigest } = useIntelligence();
  const displayIntelligence = digest;

  useEffect(() => {
    if (activeProject) {
      fetchDigest();
    }
  }, [activeProject, fetchDigest]);

  if (!activeProject) {
    return (
      <div className="flex items-center justify-center h-[50vh] text-muted-foreground">
        Please select or create a project first.
      </div>
    );
  }

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case "positive":
        return "bg-emerald-500/10 text-emerald-700";
      case "cautious":
        return "bg-amber-500/10 text-amber-700";
      case "negative":
        return "bg-red-500/10 text-red-700";
      default:
        return "bg-blue-500/10 text-blue-700";
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-border pb-6">
        <div>
          <h1 className="text-3xl font-bold font-merriweather tracking-tight">
            Weekly Intelligence
          </h1>
          <p className="text-muted-foreground mt-1">
            Market trends, competitive moves, and actionable advice for{" "}
            {activeProject?.niche || "your niche"}.
          </p>
        </div>
        <Button
          onClick={refreshDigest}
          variant="outline"
          className="border-primary/20 hover:bg-primary/5"
          disabled={loading}
        >
          <RefreshCw
            className={`w-4 h-4 mr-2 ${loading ? "animate-spin" : ""}`}
          />
          {loading ? "Analyzing..." : "Refresh"}
        </Button>
      </div>

      {loading && !displayIntelligence ? (
        <div className="flex flex-col items-center justify-center py-20 space-y-4">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <p className="text-muted-foreground">
            Analyzing market trends and competitive landscape...
          </p>
        </div>
      ) : !displayIntelligence ? (
        <div className="text-center py-20 border border-dashed rounded-xl border-border bg-muted/10 flex flex-col items-center">
          <Sparkles className="w-12 h-12 text-muted-foreground mb-4 opacity-50" />
          <h3 className="text-xl font-semibold mb-2">No Intelligence Yet</h3>
          <p className="text-muted-foreground max-w-sm mx-auto mb-6">
            Your weekly intelligence report will appear here.
          </p>
        </div>
      ) : (
        <>
          {/* Key Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 rounded-xl bg-card border border-border"
            >
              <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-2">
                Trends
              </p>
              <p className="text-2xl font-bold">
                {displayIntelligence.trends.length}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                market movements
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 }}
              className="p-4 rounded-xl bg-card border border-border"
            >
              <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-2">
                Competitors
              </p>
              <p className="text-2xl font-bold">
                {displayIntelligence.competitive_moves.length}
              </p>
              <p className="text-xs text-muted-foreground mt-1">recent moves</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="p-4 rounded-xl bg-card border border-border"
            >
              <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-2">
                Sentiment
              </p>
              <p
                className={`text-sm font-bold capitalize px-2 py-1 rounded w-fit ${getSentimentColor(displayIntelligence.sentiment)}`}
              >
                {displayIntelligence.sentiment}
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="p-4 rounded-xl bg-card border border-border"
            >
              <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-2">
                Week
              </p>
              <p className="text-xl font-bold">#{displayIntelligence.week}</p>
              <p className="text-xs text-muted-foreground mt-1">
                {new Date(displayIntelligence.created_at).toLocaleDateString()}
              </p>
            </motion.div>
          </div>

          {/* Trends Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="p-6 sm:p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <TrendingUpIcon className="w-5 h-5 text-primary" />
                </div>
                <h2 className="text-xl font-bold">Market Trends</h2>
              </div>

              <div className="space-y-4">
                {displayIntelligence.trends.map((trend: Trend, idx: number) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 + idx * 0.1 }}
                    className="p-4 rounded-lg bg-muted/50 border border-border/50 hover:border-border transition-colors"
                  >
                    <div className="flex items-start justify-between gap-4 mb-3">
                      <div>
                        <h3 className="font-bold text-sm">{trend.title}</h3>
                        <p className="text-xs text-muted-foreground mt-1">
                          {trend.forecast}
                        </p>
                      </div>
                      <Badge
                        variant="secondary"
                        className="bg-emerald-500/10 text-emerald-700 border-emerald-200"
                      >
                        +{trend.growth_percentage}%
                      </Badge>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {trend.keywords.map((kw: string) => (
                        <Badge key={kw} variant="outline" className="text-xs">
                          #{kw}
                        </Badge>
                      ))}
                    </div>
                    <div className="mt-3 flex gap-2 flex-wrap">
                      {trend.sources.map((source: string) => (
                        <span
                          key={source}
                          className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded"
                        >
                          {source}
                        </span>
                      ))}
                    </div>
                  </motion.div>
                ))}
              </div>
            </Card>
          </motion.div>

          {/* Insights Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="p-6 sm:p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
                  <Target className="w-5 h-5 text-blue-600" />
                </div>
                <h2 className="text-xl font-bold">Deep Market Insights</h2>
              </div>

              <div className="prose prose-sm max-w-none text-muted-foreground">
                {displayIntelligence.insights
                  .split("\n")
                  .map((line: string, idx: number) => (
                    <p key={idx} className="text-sm leading-relaxed">
                      {line}
                    </p>
                  ))}
              </div>
            </Card>
          </motion.div>

          {/* Competitive Moves */}
          {displayIntelligence.competitive_moves.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Card className="p-6 sm:p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center">
                    <Briefcase className="w-5 h-5 text-amber-600" />
                  </div>
                  <h2 className="text-xl font-bold">Competitive Moves</h2>
                </div>

                <div className="space-y-3">
                  {displayIntelligence.competitive_moves.map(
                    (move: CompetitiveMove, idx: number) => (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4 + idx * 0.1 }}
                        className="p-4 rounded-lg bg-muted/50 border border-border/50"
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <p className="font-bold text-sm">{move.company}</p>
                            <p className="text-sm text-muted-foreground mt-1">
                              {move.move}
                            </p>
                            <p className="text-xs text-muted-foreground mt-2">
                              {new Date(move.date).toLocaleDateString()}
                            </p>
                          </div>
                          <Badge
                            variant="secondary"
                            className="bg-orange-500/10 text-orange-700"
                          >
                            {Math.round(move.relevance * 100)}%
                          </Badge>
                        </div>
                      </motion.div>
                    ),
                  )}
                </div>
              </Card>
            </motion.div>
          )}

          {/* Actionable Advice */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Card className="p-6 sm:p-8 bg-linear-to-br from-primary/5 to-transparent border-primary/20">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Zap className="w-5 h-5 text-primary" />
                </div>
                <h2 className="text-xl font-bold">This Week's Action Plan</h2>
              </div>

              <div className="space-y-4">
                {displayIntelligence.actionable_advice
                  .split("\n")
                  .map((line: string, idx: number) => {
                    if (
                      line.trim().startsWith("**") &&
                      line.trim().endsWith("**")
                    ) {
                      return (
                        <div
                          key={idx}
                          className="flex items-start gap-3 mt-4 pt-4 border-t border-border/50"
                        >
                          <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                          <p className="font-bold text-sm">
                            {line.replace(/\*\*/g, "")}
                          </p>
                        </div>
                      );
                    }
                    return (
                      <p key={idx} className="text-sm text-muted-foreground">
                        {line}
                      </p>
                    );
                  })}
              </div>
            </Card>
          </motion.div>

          {/* Data Summary */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <Card className="p-6 sm:p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-slate-500/10 flex items-center justify-center">
                  <BarChart3 className="w-5 h-5 text-slate-600" />
                </div>
                <h2 className="text-xl font-bold">By The Numbers</h2>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {Object.entries(displayIntelligence.data_summary).map(
                  ([key, value]) => (
                    <div key={key} className="p-3 rounded-lg bg-muted/50">
                      <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                        {key.replace(/_/g, " ")}
                      </p>
                      <p className="text-sm font-bold mt-2">{value}</p>
                    </div>
                  ),
                )}
              </div>
            </Card>
          </motion.div>

          {/* Pro CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="p-6 sm:p-8 rounded-3xl bg-card border border-primary/20 flex flex-col md:flex-row items-center justify-between gap-6"
          >
            <div>
              <h3 className="font-bold text-lg mb-2">
                Ready to leverage these insights?
              </h3>
              <p className="text-sm text-muted-foreground max-w-md">
                Upgrade to Pro for deeper market analysis, custom research, and
                direct advice on positioning your product.
              </p>
            </div>
            <Button className="bg-white text-black hover:bg-neutral-100 font-bold whitespace-nowrap">
              Upgrade to Pro
            </Button>
          </motion.div>
        </>
      )}
    </div>
  );
}
