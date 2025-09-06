const { response } = require("express");
const pool = require("../config/db.config");

exports.createCart = async (req, res) => {
  const userId = req.user?.id;
  const { product_id, quantity } = req.body;

  if (!product_id || !Number.isInteger(quantity) || quantity <= 0) {
    return res.status(400).json({message: "Invalid input: product_id and positive quantity are required",});
  }
  try{
    const productResult = await pool.query(
        `SELECT id,stock FROM products WHERE id=$1`,[product_id]
    )
    const product = productResult.rows[0];
    if(product.stock < quantity ){
        return res.status(400).json({ message: "Insufficient stock" });
    }

    
    let cartId;
    let responseItem;

    // loggedIn users
    if(userId){
        let cartResult = await pool.query(`SELECT id FROM carts WHERE user_id=$1`,[userId])
    
        if(cartResult.rows.length === 0){
            cartResult = await pool.query(
                `INSERT INTO carts (user_id) VALUES ($1) RETURNING id`,[userId]
            );
            cartId = cartResult.rows[0].id
        }else{
            cartId = cartResult.rows[0].id
        }

    const existingItem = await pool.query(
        `SELECT id,quantity FROM cart_items WHERE cart_id = $1 AND product_id = $2`,[cartId,product_id]
    )

    if(existingItem.rows.length >0){
        const newQuantity = existingItem.rows[0].quantity + quantity;
        if(product.stock < newQuantity){
            return res.status(400).json({ message: "Insufficient stock for updated quantity" });
        }
       const updatedItem = await pool.query(
            `UPDATE cart_items SET quantity = $1 WHERE id = $2 RETURNING id, cart_id, product_id, quantity`,
            [newQuantity,existingItem.rows[0].id]
        )
        responseItem = updatedItem.rows[0];
    }else{
       const newItem = await pool.query(
            `INSERT INTO cart_items (cart_id,product_id,quantity) VALUES($1,$2,$3) RETURNING id, cart_id, product_id, quantity`,[cartId,product_id,quantity]
        );
        responseItem = newItem.rows[0]
    }
    // Gustes 
    }else{
        if(!req.session){
            return res.status(500).json({ message: "Session not initialized" });
        }
        if(!req.session.cart){
            req.session.cart = []
        }

        const existingItem = req.session.cart.find((item)=> item.product_id === product_id);
        if(existingItem){
            const newQuantity = existingItem.quantity + quantity;

            if(product.stock < newQuantity){
                return res.status(400).json({ message: "Insufficient stock for updated quantity" });
            }
            existingItem.quantity = newQuantity;
            responseItem = existingItem;
        }else{
            responseItem = {id:Date.now(),product_id,quantity}
            req.session.cart.push(responseItem)
        }

        // الاول يحفظ السيشن بعد كدا يرسل الاستجابة 
        await new Promise((resolve, reject) => {
        req.session.save((err) => {
          if (err) {
            console.error("Error saving session:", err.message);
            reject(err);
          } else {
            resolve();
          }
        });
      });
    }

    res.status(201).json({message:"Product added to cart successfully",item:responseItem })
  }catch(err){
    console.error("Error adding to cart:", err.message)
    res.status(500).json({message:"Smothing Wrong", error: err.message})
  }
};


exports.getCart = async(req,res)=>{
    const userId = req.user?.id;
    
    try{
        if(userId){
        const cartResult =await pool.query(
            `SELECT id FROM carts WHERE user_id = $1`,[userId]
        )
        if(cartResult.rows.length === 0){
            return res.status(200).json({message : "cart is empty", cart: []})
        }
        const cartId = cartResult.rows[0].id;

        const itemsResult = await pool.query(
            `SELECT ci.id, ci.product_id, ci.quantity, p.name, p.description, p.price 
             FROM cart_items ci 
             JOIN products p ON ci.product_id = p.id
             WHERE ci.cart_id = $1
            `,[cartId]
        )
        res.status(200).json({message:"Successed", cart:itemsResult.rows})
    }else{

        // Gustes 
        if(!req.session.cart || req.session.cart.length === 0){
            return res.status(200).json({message : "cart is empty", cart: []})
        }
        const productIds = req.session.cart.map((item)=> item.product_id)
        const itemsResult = await pool.query(
            `SELECT id AS product_id ,name,description,price FROM products WHERE id = ANY($1)`,[productIds]
        )

        const cart = req.session.cart.map((item) => {
          const product = itemsResult.rows.find(
            (p) => p.product_id === item.product_id
          );
          return {
            id: item.id,
            product_id: item.product_id,
            quantity: item.quantity,
            name: product?.name || "Unknown",
            description: product?.description || "No description",
            price: product?.price || 0,
          };
        });
        res.status(200).json({ message: "Success", cart });
    }
    }catch(err){
        console.log(err);
        res.status(500).json({message:"Smothing Wrong", error: err.message})    }
};

// remove From Cart By giving the id of the item through the params
exports.removeFromCart = async (req,res)=>{
    const itemId = req.params.id
    const userId = req.user?.id;

    try{
        const cartResult =await pool.query(
            `SELECT * FROM carts WHERE user_id = $1`,[userId]
        )
        if(cartResult.rows.length === 0){
            return res.status(404).json({ message: "Cart not found" });
        }
        const cartId = cartResult.rows[0].id;

        const deleteResult =await pool.query(
            `DELETE FROM cart_items WHERE id = $1 AND cart_id = $2 RETURNING id`,[itemId,cartId]
        )
        if(deleteResult.rows.length ===0){
            return res.status(404).json({message: "Item not found in cart"});
        }
        res.status(200).json({ message: "Item removed from cart successfully" });
    }catch(err){
        console.error("Error removing from cart:", err);
        res.status(500).json({ message: "Failed to remove from cart" });
    }
}