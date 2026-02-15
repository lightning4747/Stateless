import Navbar from "components/Navbar";
import { Github, Mail } from "lucide-react";
import Button from "components/ui/Button";

export default function Construction() {
    return (
        <div className="home">
            <Navbar />
            <section className="pt-32 min-h-screen flex items-center justify-center text-center px-6">
                <div className="max-w-2xl mx-auto space-y-8">
                    <div className="space-y-4">
                        <h1 className="text-4xl font-bold">🚧 Under Construction</h1>
                        <p className="text-xl text-white/70 leading-relaxed">
                            Stateless is currently a solo hobby project. I'm focusing on the core editor features first, so Pricing and Enterprise modules are still in the lab!
                        </p>
                    </div>

                    <div className="bg-white/5 border border-white/10 rounded-2xl p-8 space-y-6">
                        <h2 className="text-xl font-semibold">If you have feedback, find a bug, or want to request a feature, I’d love to hear from you:</h2>

                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <a
                                href="https://github.com/lightning4747/Stateless/issues"
                                target="_blank"
                                rel="noreferrer"
                                className="w-full sm:w-auto"
                            >
                                <Button variant="secondary" className="w-full justify-center">
                                    <Github className="w-4 h-4 mr-2" />
                                    Open an Issue
                                </Button>
                            </a>

                            <a
                                href="mailto:vignesh112947@gmail.com"
                                className="w-full sm:w-auto"
                            >
                                <Button variant="secondary" className="w-full justify-center">
                                    <Mail className="w-4 h-4 mr-2" />
                                    Say Hello
                                </Button>
                            </a>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
