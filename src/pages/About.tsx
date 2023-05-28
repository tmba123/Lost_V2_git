import { Helmet, HelmetProvider } from "react-helmet-async";



export function About() {
    return (
        <HelmetProvider>
            <Helmet>
                <meta charSet="utf-8" />
                <title>Lost Videogames - About</title>
            </Helmet>
            <div>
                <div className="card w-full bg-base-100 shadow-xl">
                    <h5 className="card-title">
                        About
                    </h5>
                    <br />
                    <br />
                    <div className="d-flex justify-content-center align-items-center text-lg font-semibold">
                        Inventory management Web application developed for the stock control needs of a video game store “Lost Videogames”.
                    </div>
                    <br />
                    <div className="d-flex justify-content-center align-items-center text-lg font-semibold">
                        Developed by Tiago Agostinho with Vite+React+TypeScript+tailwindcss+daisyUI and Supabase. Code editor, Visual Studio Code.
                    </div>
                    <br />
                    <br />
                    <div className="d-flex justify-content-center align-items-center text-left text-lg font-semibold">
                    Functionalities:
                    </div>
                    <br />
                    <div className="d-flex justify-content-center align-items-center text-left text-base font-semibold">
                    Publishers:
                    </div>
                    <br />
                    <div className="d-flex justify-content-center align-items-center text-left text-sm font-normal">
                    Here the user can list, create, edit and search videogames publishers.
                    </div>
                    <br />
                    <div className="d-flex justify-content-center align-items-center text-left text-base font-semibold">
                    Games:
                    </div>
                    <br />
                    <div className="d-flex justify-content-center align-items-center text-left text-sm font-normal">
                        <p>Here the user can list, create, edit and search videogames products.</p>
                        <p>It is only possible to create videogames products from a list of enabled publishers.</p>
                        <p>Note: It is not possible to disable videogame product if available stock of this product exists in inventory.</p>
                    </div>
                    <br />
                    <div className="d-flex justify-content-center align-items-center text-left text-base font-semibold">
                    Warehouse:
                    </div>
                    <br />
                    <div className="d-flex justify-content-center align-items-center text-left text-sm font-normal">
                        <p>Here the user can list, create, edit and search Warehouses.</p>
                        <p>Note: It is not possible to disable Warehouse if the warehouse contains products in stock.</p>
                        <p>Also Warehouse “Transit” cannot be edited as this warehouse is used as a placeholder for </p>
                        <p>“in_transit” movements (Inventory movements between warehouses).</p>
                    </div>
                    <br />
                    <div className="d-flex justify-content-center align-items-center text-left text-base font-semibold">
                    Inventory - Stock:
                    </div>
                    <br />
                    <div className="d-flex justify-content-center align-items-center text-left text-sm font-normal">
                    Here the user can list and search available stock in inventory.
                    </div>
                    <br />
                    <div className="d-flex justify-content-center align-items-center text-left text-base font-semibold">
                    Inventory – Movements:
                    </div>
                    <br />
                    <div className="d-flex justify-content-center align-items-center text-left text-sm font-normal">
                        <p>Here the user can list and search inventory movements.</p>
                        <p>By selecting the “Create Movement” option the user can add or remove products from stock</p>
                        <p>and move stock between warehouses.</p>
                        <p>Note: All operations performed on the Inventory are stored in the database as movements with the </p>
                        <p>information of movement date, quantity, movement type, product and warehouse.</p>
                        <p>The Inventory of products is also updated accordingly with the operations performed by the user.</p>
                    </div>
                </div>
            </div>
        </HelmetProvider>
    )
}