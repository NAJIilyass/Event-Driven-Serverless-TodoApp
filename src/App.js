import Home from "./pages/Home";
import Navbar from "./components/Navbar";

function App() {
    return (
        <div className="bg-blue-950 min-h-screen font-mono min-w-fit">
            <Navbar />
            <div className="pages">
                <Home />
            </div>
            <footer className="text-transparent">.</footer>
        </div>
    );
}

export default App;
