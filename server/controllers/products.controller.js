const pool = require("../config/db.config");
const cache = require("../util/memory-cache.utils");

exports.createProduct = async (req,res) => {
    const { name, description, price, stock } = req.body;
  try {
    const createProduct = await pool.query(
      `INSERT INTO products (name,description,price,stock) VALUES ($1,$2,$3,$4) RETURNING *`,
      [name, description, price, stock]
    );
    res.status(201).json({message : "Successed ",Product: createProduct.rows})
  } catch (err) {
    console.log(err.message);
    res.status(400).send(err.message)
  }
};


exports.getProductById = async (req,res)=>{
    const id = req.params.id;
    const cacheKey = `product:${id}`;
    try{
        const cached = cache.get(cacheKey);
        if(cached){
            return res.status(200).json({
                message: "cached List are :",
                source: "Cache",
                data: cached,
            });
        }
        const getProduct =await pool.query(
            `SELECT * FROM products WHERE id = $1 `,[id]
        )
        cache.set(cacheKey,getProduct.rows)
        res.status(201).json({message : "Successed ", Product: getProduct.rows})
    }catch(err){
    console.log(err.message);
    res.status(400).send(err.message)
    }
}

exports.getProducts = async(req,res)=>{
    const cacheKey = `allProducts`;
    try{
        const cached = cache.get(cacheKey)
        if(cached){
            return res.status(200).json({
                message: "cached List are :",
                source: "Cache",
                data: cached,
            });
        }
        const getProduct = await pool.query(
            `SELECT * FROM products`
        )

        cache.set(cacheKey,getProduct.rows)
       res.status(201).json({message : "Successed ", Product: getProduct.rows})
    }catch(err){
    console.log(err.message);
    res.status(400).send(err.message)
    }
}

exports.deleteProduct = async (req,res)=>{
    try{
        const id = req.params.id
        const deleteProduct = await pool.query(
            `DELETE FROM products WHERE id = $1 `,[id]
        )
        res.status(200).json({message : "Deleted "})
    }catch(err){
        console.log(err.message);
        res.status(400).send(err.message)
    }
}

exports.updateProduct = async (req,res)=>{
    try{
        const { name, description, price, stock } = req.body;
        const id = req.params.id
        const updateProduct = await pool.query(
            `UPDATE products 
            SET name = $1 , description =$2 , price =$3, stock = $4 
            WHERE id = $5
            RETURNING *`,[name,description,price,stock,id]
         )
       res.status(200).json({message : "Successed ", Product: updateProduct.rows})
    }catch(err){
        console.log(err.message);
        res.status(400).send(err.message)
    }
}