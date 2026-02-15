import { useEffect, useState } from "react";
import { getProjects } from "~/lib/puter.action";
import { useNavigate } from "react-router";
import Navbar from "components/Navbar";
import Button from "components/ui/Button";
import { ArrowUpRight, Clock, Search, Loader2 } from "lucide-react";

export default function Community() {
    const [projects, setProjects] = useState<DesignItem[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProjects = async () => {
            setIsLoading(true);
            try {
                const allProjects = await getProjects();
                // Filter for public projects only
                const publicProjects = allProjects.filter(p => p.isPublic);
                setProjects(publicProjects);
            } catch (error) {
                console.error("Failed to load community projects:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchProjects();
    }, []);

    // Filter projects based on the search query
    const filteredProjects = projects.filter((project) =>
        project.name?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="home">
            <Navbar />
            <section className="projects pt-32 min-h-screen">
                <div className="section-inner">
                    <div className="section-head flex flex-col md:flex-row md:items-end justify-between gap-6">
                        <div className="copy">
                            <h2 className="text-4xl font-bold">Community Projects</h2>
                            <p className="text-muted-foreground mt-2">
                                Explore designs shared by the Stateless community.
                            </p>
                        </div>

                        <div className="flex items-center gap-4 w-full md:w-auto">
                            {/* Search Bar */}
                            <div className="relative w-full md:w-64">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                                <input
                                    type="text"
                                    placeholder="Search projects..."
                                    className="w-full pl-10 pr-4 py-2 bg-secondary rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary/50"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                            <Button variant="outline" onClick={() => navigate('/')}>
                                Back to Home
                            </Button>
                        </div>
                    </div>

                    <hr className="my-10 border-border" />

                    {isLoading ? (
                        <div className="flex flex-col items-center justify-center py-20 gap-4">
                            <Loader2 className="animate-spin text-primary" size={40} />
                            <p className="text-muted-foreground">Fetching community designs...</p>
                        </div>
                    ) : (
                        <div className="projects-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredProjects.length > 0 ? (
                                filteredProjects.map(({ id, name, renderedImage, sourceImage, timestamp, sharedBy }) => (
                                    <div
                                        className="project-card group cursor-pointer border border-border rounded-xl overflow-hidden hover:border-primary/50 transition-all"
                                        key={id}
                                        onClick={() => navigate(`/visualizer/${id}`)}
                                        role="button"
                                        tabIndex={0}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter' || e.key === ' ') {
                                                e.preventDefault();
                                                navigate(`/visualizer/${id}`);
                                            }
                                        }}
                                    >
                                        <div className="preview aspect-video overflow-hidden bg-muted">
                                            <img 
                                                src={renderedImage || sourceImage} 
                                                alt={name || "Project"} 
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                            />
                                        </div>
                                        <div className="card-body p-4 flex justify-between items-start">
                                            <div>
                                                <h3 className="font-semibold text-lg">{name || "Untitled Project"}</h3>
                                                <div className="meta flex items-center gap-2 text-sm text-muted-foreground mt-1">
                                                    <Clock size={12} />
                                                    <span>{new Date(timestamp).toLocaleDateString()}</span>
                                                    {sharedBy && (
                                                        <>
                                                            <span>•</span>
                                                            <span className="text-primary font-medium">{sharedBy}</span>
                                                        </>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="arrow p-2 rounded-full bg-secondary text-secondary-foreground group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                                                <ArrowUpRight size={18} />
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="empty col-span-full py-20 text-center border-2 border-dashed border-border rounded-2xl">
                                    <p className="text-xl font-medium">No projects found.</p>
                                    <p className="text-muted-foreground">Try a different search or be the first to share!</p>
                                </div>
                            )}
                            </div>
                    )}
                </div>
            </section>
        </div>
    );
}