export default function header() {
    return (
        <header data-theme="retro" className="pt-3 pb-3 px-3 flex justify-between items-center">
            <h1 className="text-2xl font-bold">Portfolio</h1>
            <div className="flex items-center gap-4">
                <a href="/">Home</a>
                <a href="/">About</a>
                <a href="/">Contact</a>
            </div>
        </header>
    )
}