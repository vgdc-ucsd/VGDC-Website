import Navbar from '@/components/Navbar';
import Home from './pages/index'

function App() {
    return (
        <main className="min-h-screen bg-background-black">
            <Navbar />
            <Home allPostsData={[]}/>
        </main>
    )
}

export default App;