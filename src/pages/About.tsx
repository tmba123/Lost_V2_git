export function About(){
    return (
        <body>
        <h1>About</h1>
<br />
<div className="d-flex justify-content-center align-items-center">

    <h5>Inventory management Web application developed for the stock control needs of a video game store “Lost Videogames”.</h5>

</div>
<br />
<div className="d-flex justify-content-center align-items-center">

    <h5>Developed by Tiago Agostinho in C# with ASP.NET Core Framework and MySql database. IDE Microsoft Visual Studio.</h5>

</div>
<br />
<div>
    <h5>Functionalities:</h5>
</div>
<br />
<div>
    <h6>Publishers:</h6>
</div>
<div>
    <p>Here the user can list, create, edit and search videogames publishers.</p>
    <p>Note: It is not possible to disable publisher if a videogame product from thar publisher exists in the enabled state.</p>
</div>
<br />
<div>
    <h6>Games:</h6>
</div>
<div>
    <p>Here the user can list, create, edit and search videogames products.</p>
    <p>It is only possible to create videogames products from a list of enabled publishers.</p>
    <p>Note: It is not possible to disable videogame product if available stock of this product exists in inventory.</p>
    <p>Also it is not possible to enable the videogame product if the publisher of this product is disabled.</p>
</div>
<br />
<div>
    <h6>Warehouse:</h6>
</div>
<div>
    <p>Here the user can list, create, edit and search Warehouses.</p>
    <p>Note: It is not possible to disable Warehouse if the warehouse contains products in stock.</p>
    <p>Also Warehouse “Transit” cannot be edited as this warehouse is used as a placeholder for </p>
    <p>“in_transit” movements (Inventory movements between warehouses).</p>
</div>
<br />
<div>
    <h6>Inventory - Stock:</h6>
</div>
<div>
    <p>Here the user can list and search available stock in inventory.</p>
</div>
<br />
<div>
    <h6>Inventory – Movements:</h6>
</div>
<div>
    <p>Here the user can list and search inventory movements.</p>
    <p>By selecting the “Create Movement” option the user can add products to stock, remove products</p>
    <p>from stock and move stock between warehouses.</p>
    <p>Note: All operations performed on the Inventory are stored in the database as movements with the </p>
    <p>information of movement date, quantity, movement type, product and warehouse.</p>
    <p>The Inventory of products is also updated accordingly with the operations performed by the user.</p>
</div>
</body>
    )
}