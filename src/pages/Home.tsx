import {Helmet, HelmetProvider} from "react-helmet-async";


export function Home() {
    return (
        <HelmetProvider>
        <main>
            <div>
            <Helmet>
                <meta charSet="utf-8" />
                <title>Lost Videogames - Home</title>
            </Helmet>
                <div>
                    <br />
                    <br />
                </div>
                <div className="text-center">
                    <h1 className="text-2xl">Welcome</h1>
                </div>
                <div className="text-center">
                    <h1 className="text-2xl">To Lost VideoGames</h1>
                </div>
                <div className="text-center">
                    <h1 className="text-2xl">Inventory Management</h1>
                </div>
                <div>
                    <br />
                    <br />
                    <img className="w-96 h-96 object-contain max-w-full mx-auto" src="./src/lib/img/backgroundgames.png" />
                </div>
            </div>
        </main>
        </HelmetProvider>
    )
}