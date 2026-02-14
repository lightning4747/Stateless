import { ArrowRight, ArrowUpRight, Clock, Layers } from "lucide-react";
import type { Route } from "./+types/home";
import Navbar from "components/Navbar";
import Button from "components/ui/Button"

export function meta({}: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export default function Home() {
  return (
    <div className="home">
      <Navbar/>
     
      <section className="hero">
        <div className="announce">
          <div className="dot">
            <div className="pulse"></div>
          </div>
          <p>stateless architecture</p> {/*later come up smt good*/}
        </div>
          <h1>Architect your Thoughts with the power of AI</h1>

          <p className="subtitle">
            Stateless is an desgining environment where AI can help you visualize, download and architect faster.
          </p>

          <div className="actions">
            <a href="#upload" className="cta">
              Start Building <ArrowRight className="icon"/>
            </a>

            <Button 
            variant="outline" 
            size="lg" 
            className="demo">Watch Demo</Button>
          </div>

          <div id="upload" className="upload-shell">
            <div className="grid-overlay" />
              <div className="upload-card">
                <div className="upload-head">
                  <div className="upload-icon">
                    <Layers className="icon" />
                  </div>
                  <h3>Upload your floor plan</h3>
                  <p>Support JPG, PNG, formats up to 10MB</p>
                </div>
                <p>upload image</p>

              </div>
          </div>
      </section>


    </div>

  )
}
