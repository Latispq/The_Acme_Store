const express = require("express");
const {
	client,
	createTable,
	createProduct,
	createUser,
	fetchUsers,
	fetchProducts,
	createFavorite,
	fetchFavorites,
	destroyFavorite,
} = require("./db");
const app = express();

app.use(express.json());
app.use(require("morgan")("dev"));

app.get("/api/users", async (req, res, next) =>
{
	try
	{
		res.send(await fetchUsers());
	}
	catch (err)
	{
		next(err);
	}
});

app.get("/api/products", async (req, res, next) =>
{
	try
	{
		res.send(await fetchProducts());
	}
	catch (err)
	{
		next(err);
	}
});

app.get("/api/users/:id/favorites", async (req, res, next) =>
{
	try
	{
		res.send(await fetchFavorites(req.params.id));
	}
	catch (err)
	{
		next(err);
	}
});

app.post("/api/users/:id/favorites", async (req, res, next) =>
{
	try
	{
		res.status(201).send(await createFavorite(req.params.id, req.body.product_id));
	}
	catch (err)
	{
		next(err);
	}
});


app.delete("/api/users/:userId/favorites/:id", async (req, res, next) =>
{
	try
	{
		await destroyFavorite(req.params.id);
		res.sendStatus(204);
	}
	catch (err)
	{
		next(err);
	}
});

const init = async () =>
{
	console.log("connecting to db");
	await client.connect();
	console.log("connected to db");

	console.log("creating table");
	await createTable();
	console.log("created table");

	console.log("seeding db");
	const p = await createProduct("testProduct");
	const u = await createUser("gerald", "myPassword");
	const f = await createFavorite(u.id, p.id);
	console.log(f.id);
	console.log("seeded db");

	const PORT = 3000;
	app.listen(PORT, () =>
	{
		console.log(`listening on port ${PORT}`);
	});
};

init();