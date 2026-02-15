import { Zap } from "lucide-react";
import Button from "./ui/Button";
import { useOutletContext, Link } from "react-router";

const Navbar = () => {
    const { isSignedIn, userName, signIn, signOut } = useOutletContext<AuthContext>()
    const greetings = [
        "Hello",
        "Hi!",
        "Hey 👋",
        "Greetings",
        "Yo!",
        "Welcome",
        "Howdy 🤠",
        "Alphas",
        "Cheers 🍻",
        "Namaste",
        "Ciao!",
        "Hola",
        "Bonjour ✨",
        "Sup?",
        "Ahoy ⚓"
    ];
    const randomGreeting = Math.floor(Math.random() * greetings.length);
    const greeting = greetings[randomGreeting];
    const handleAuthClick = async () => {
        if (isSignedIn) {
            try {
                await signOut();
            } catch (e) {
                console.error(`Puter sign out failed: ${e}`);
            }

            return;
        }

        try {
            await signIn();
        } catch (e) {
            console.error(`Puter sign in failed: ${e}`);
        }
    };

    return (
        <header className="navbar">
            <nav className="inner">
                <div className="left">
                    <Link to="/">
                        <div className="brand">
                            <Zap className="logo" />

                            <span className="name">
                                Stateless
                            </span>
                        </div>
                    </Link>

                    <ul className="links">
                        <Link to="/construction">Product</Link>
                        <Link to="/construction">Pricing</Link>
                        <Link to="/community">Community</Link>
                        <Link to="/construction">Enterprise</Link>
                    </ul>
                </div>

                <div className="actions">
                    {isSignedIn ? (
                        <>
                            <span className="greeting">
                                {userName ? `${greeting}, ${userName}` : 'Signed in'}
                            </span>

                            <Button size="sm" onClick={handleAuthClick} className="btn">
                                Log Out
                            </Button>
                        </>
                    ) : (
                        <>
                            <Button onClick={handleAuthClick} size="sm" variant="ghost">
                                Log In
                            </Button>

                            <a href="#upload" className="cta">Get Started</a>
                        </>
                    )}
                </div>
            </nav>
        </header>
    )
}

export default Navbar