import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useProjectStore } from "../../store/projectStore";
import { useAuthStore } from "../../store/authStore";
import { useProjects } from "../../hooks/useProjects";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Textarea } from "../../components/ui/Textarea";
import {
  User,
  Building,
  Palette,
  Plus,
  Loader2,
  ChevronRight,
  X,
  Edit2,
  Crown,
  Sparkles,
  ArrowRight,
  Check,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "../../lib/utils";
import type { ProjectStage, Project } from "../../types/project";

export default function Settings() {
  const { activeProject, projects, setActiveProject } = useProjectStore();
  const { user } = useAuthStore();
  const { updateProject, createProject, loading } = useProjects();

  const [showProjectModal, setShowProjectModal] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);

  const [projectForm, setProjectForm] = useState({
    name: "",
    niche: "",
    stage: "mvp" as ProjectStage,
    description: "",
    target_audience: "",
    brand_voice_examples: ["", "", ""],
  });

  const handleOpenProjectManager = () => {
    setEditingProject(null);
    setProjectForm({
      name: "",
      niche: "",
      stage: "mvp",
      description: "",
      target_audience: "",
      brand_voice_examples: ["", "", ""],
    });
    setShowProjectModal(true);
  };

  const handleEditProject = (project: Project) => {
    setEditingProject(project);
    setProjectForm({
      name: project.name || "",
      niche: project.niche || "",
      stage: project.stage || "mvp",
      description: project.description || "",
      target_audience: project.target_audience || "",
      brand_voice_examples: project.brand_voice_examples || ["", "", ""],
    });
    setShowProjectModal(true);
  };

  const handleSelectProject = (project: Project) => {
    setActiveProject(project);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-in fade-in duration-500 pb-20">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold font-merriweather tracking-tight">
          Settings
        </h1>
        <p className="text-muted-foreground mt-1">
          Manage your account and subscription.
        </p>
      </div>

      {/* Project Card */}
      <div className="p-5 rounded-3xl bg-card border border-border">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <Building className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h2 className="text-lg font-bold">Current Project</h2>
              <p className="text-xs text-muted-foreground">
                {activeProject?.name || "No project selected"}
              </p>
            </div>
          </div>
          <Button
            onClick={handleOpenProjectManager}
            className="bg-primary/10 text-primary hover:bg-primary/20 border border-primary/20"
          >
            <Edit2 className="w-3 h-3 mr-2" />
            Manage Projects
          </Button>
        </div>

        {activeProject && (
          <div className="flex flex-wrap gap-2">
            <span className="px-3 py-1 rounded-full bg-muted text-xs font-medium capitalize">
              {activeProject.niche}
            </span>
            <span className="px-3 py-1 rounded-full bg-muted text-xs font-medium capitalize">
              {activeProject.stage}
            </span>
          </div>
        )}
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Brand Voice */}
        <div className="p-5 rounded-3xl bg-card border border-border space-y-5">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold flex items-center gap-2">
              <Palette className="w-5 h-5 text-primary" />
              Brand Voice
            </h2>
            <span className="flex items-center gap-1 text-[10px] text-amber-500">
              <Sparkles className="w-3 h-3" />
              Pro Feature
            </span>
          </div>

          <p className="text-xs text-muted-foreground">
            Add examples of your writing to help AI match your style.
          </p>

          <div className="space-y-2">
            {activeProject?.brand_voice_examples?.map((example, i) => (
              <div
                key={i}
                className="p-3 rounded-xl bg-muted/30 text-xs text-muted-foreground line-clamp-2"
              >
                {example || "No example added"}
              </div>
            ))}
            {(!activeProject?.brand_voice_examples ||
              activeProject.brand_voice_examples.length === 0) && (
              <p className="text-xs text-muted-foreground italic">
                No examples added yet
              </p>
            )}
          </div>

          <Button
            variant="outline"
            className="w-full border-primary/20"
            onClick={handleOpenProjectManager}
          >
            Add Writing Examples
          </Button>
        </div>

        {/* Account */}
        <div className="p-5 rounded-3xl bg-card border border-border space-y-5">
          <h2 className="text-lg font-bold flex items-center gap-2">
            <User className="w-5 h-5 text-primary" />
            Account
          </h2>

          <div className="flex items-center gap-3 p-3 rounded-2xl bg-muted/50">
            <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary font-bold text-lg">
              {user?.email?.charAt(0).toUpperCase() || "U"}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-bold text-sm truncate">{user?.email}</p>
              <p className="text-[10px] text-muted-foreground">Free Plan</p>
            </div>
          </div>

          <div className="space-y-2">
            <button className="w-full flex items-center justify-between p-3 rounded-xl bg-muted/30 hover:bg-muted transition-colors text-left">
              <span className="text-sm font-medium">Change Password</span>
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            </button>
            <button className="w-full flex items-center justify-between p-3 rounded-xl bg-muted/30 hover:bg-muted transition-colors text-left">
              <span className="text-sm font-medium">Two-Factor Auth</span>
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            </button>
          </div>
        </div>
      </div>

      {/* PRO Section */}
      <div className="p-6 rounded-3xl bg-card border border-primary/20 space-y-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <Crown className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h2 className="text-lg font-bold">Pro Plan</h2>
              <p className="text-xs text-muted-foreground">
                Unlock the full power of AI marketing
              </p>
            </div>
          </div>
          <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-wider">
            Most Popular
          </span>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          <div className="flex-1 space-y-4">
            <p className="text-sm text-muted-foreground leading-relaxed">
              <strong className="text-foreground">Brand Voice AI</strong> that
              writes exactly like you. Detailed weekly intelligence, unlimited
              roadmap access, and 3x more content generation.
            </p>

            <div className="flex flex-wrap gap-2">
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-muted/50 text-xs text-muted-foreground">
                <Check className="w-3 h-3 text-primary" />
                3 Projects
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-muted/50 text-xs text-muted-foreground">
                <Check className="w-3 h-3 text-primary" />
                3x Daily Generations
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-muted/50 text-xs text-muted-foreground">
                <Check className="w-3 h-3 text-primary" />
                Brand Voice AI
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-muted/50 text-xs text-muted-foreground">
                <Check className="w-3 h-3 text-primary" />
                Unlimited Roadmap
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-muted/50 text-xs text-muted-foreground">
                <Check className="w-3 h-3 text-primary" />
                Detailed Reports
              </div>
            </div>
          </div>

          <div className="lg:w-64 flex flex-col gap-3 lg:items-end lg:justify-center">
            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-bold">$29</span>
              <span className="text-sm text-muted-foreground">/month</span>
            </div>
            <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold">
              Upgrade Now <ArrowRight className="w-4 h-4 ml-1.5" />
            </Button>
            <p className="text-[10px] text-muted-foreground text-center">
              Cancel anytime. No hidden fees.
            </p>
          </div>
        </div>
      </div>

      {/* Project Modal */}
      <AnimatePresence>
        {showProjectModal && (
          <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-lg bg-card rounded-3xl border border-border p-5 space-y-5 max-h-[80vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold">
                  {editingProject ? "Edit Project" : "Manage Projects"}
                </h2>
                <button
                  onClick={() => setShowProjectModal(false)}
                  className="p-2 hover:bg-muted rounded-xl"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Projects List */}
              {!editingProject ? (
                <div className="space-y-3">
                  {projects.map((project) => (
                    <div
                      key={project.id}
                      className={cn(
                        "p-3 rounded-xl border flex items-center justify-between",
                        activeProject?.id === project.id
                          ? "border-primary bg-primary/5"
                          : "border-border bg-muted/30",
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => handleSelectProject(project)}
                          className={cn(
                            "w-5 h-5 rounded-full border-2 flex items-center justify-center",
                            activeProject?.id === project.id
                              ? "border-primary bg-primary"
                              : "border-muted-foreground",
                          )}
                        >
                          {activeProject?.id === project.id && (
                            <Check className="w-3 h-3 text-white" />
                          )}
                        </button>
                        <div>
                          <p className="font-bold text-sm">{project.name}</p>
                          <p className="text-[10px] text-muted-foreground capitalize">
                            {project.niche} • {project.stage}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => handleEditProject(project)}
                        className="p-2 hover:bg-muted rounded-lg"
                      >
                        <Edit2 className="w-4 h-4 text-muted-foreground" />
                      </button>
                    </div>
                  ))}

                  <button
                    onClick={() => {
                      setEditingProject(null);
                      setProjectForm({
                        name: "",
                        niche: "",
                        stage: "mvp",
                        description: "",
                        target_audience: "",
                        brand_voice_examples: ["", "", ""],
                      });
                    }}
                    className="w-full p-3 rounded-xl border border-dashed border-border hover:border-primary/50 hover:bg-primary/5 transition-all flex items-center justify-center gap-2"
                  >
                    <Plus className="w-4 h-4 text-primary" />
                    <span className="text-sm font-medium text-primary">
                      Add New Project
                    </span>
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                      Name
                    </label>
                    <Input
                      value={projectForm.name}
                      onChange={(e) =>
                        setProjectForm((p) => ({ ...p, name: e.target.value }))
                      }
                      placeholder="My Startup"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                      Niche
                    </label>
                    <Input
                      value={projectForm.niche}
                      onChange={(e) =>
                        setProjectForm((p) => ({ ...p, niche: e.target.value }))
                      }
                      placeholder="B2B SaaS, AI Tools, etc."
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                      Stage
                    </label>
                    <div className="flex gap-1">
                      {(
                        ["idea", "mvp", "growth", "scale"] as ProjectStage[]
                      ).map((stage) => (
                        <button
                          key={stage}
                          onClick={() =>
                            setProjectForm((p) => ({ ...p, stage }))
                          }
                          className={cn(
                            "flex-1 px-2 py-1.5 rounded-lg text-[10px] font-bold uppercase transition-all",
                            projectForm.stage === stage
                              ? "bg-primary text-white"
                              : "bg-muted text-muted-foreground",
                          )}
                        >
                          {stage}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                      Description
                    </label>
                    <Textarea
                      value={projectForm.description}
                      onChange={(e) =>
                        setProjectForm((p) => ({
                          ...p,
                          description: e.target.value,
                        }))
                      }
                      placeholder="What are you building?"
                      rows={2}
                    />
                  </div>

                  <div className="flex gap-2 pt-2">
                    <Button
                      variant="outline"
                      onClick={() => setEditingProject(null)}
                      className="flex-1"
                    >
                      Back
                    </Button>
                    <Button
                      onClick={async () => {
                        if (!projectForm.name || !projectForm.niche) {
                          toast.error("Please fill in name and niche");
                          return;
                        }
                        try {
                          if (editingProject) {
                            await updateProject(editingProject.id, {
                              name: projectForm.name,
                              niche: projectForm.niche,
                              stage: projectForm.stage,
                              description: projectForm.description,
                              target_audience: projectForm.target_audience,
                              brand_voice_examples:
                                projectForm.brand_voice_examples.filter((e) =>
                                  e.trim(),
                                ),
                            });
                            toast.success("Project updated!");
                          } else {
                            await createProject({
                              name: projectForm.name,
                              niche: projectForm.niche,
                              stage: projectForm.stage,
                              description: projectForm.description,
                              target_audience: projectForm.target_audience,
                              brand_voice_examples:
                                projectForm.brand_voice_examples.filter((e) =>
                                  e.trim(),
                                ),
                            });
                            toast.success("Project created!");
                          }
                          setShowProjectModal(false);
                        } catch (error) {
                          toast.error(
                            editingProject
                              ? "Failed to update"
                              : "Failed to create",
                          );
                        }
                      }}
                      disabled={loading}
                      className="flex-1"
                    >
                      {loading && (
                        <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                      )}
                      {editingProject ? "Save Changes" : "Create Project"}
                    </Button>
                  </div>
                </div>
              )}

              {!editingProject && (
                <div className="flex gap-2 pt-2">
                  <Button
                    variant="outline"
                    onClick={() => setShowProjectModal(false)}
                    className="flex-1"
                  >
                    Close
                  </Button>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
