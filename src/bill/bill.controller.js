'use strcit'

const Bill = require('./bill.model');
const Cart = require('../cart/cart.model');
const Product = require('../product/product.model');

exports.test = (req, res)=>{
    return res.send({message: 'Test fuction is running'});
}

exports.createBill = async(req, res)=>{
    try{
        let userId = req.user.sub;
        let { name, nit } = req.body;
        let cart = await Cart.findOne({user: userId});
        if(!cart || cart.products.length == 0) return res.send({message: 'You have not added products to your cart'});
        let products = cart.products;
        for(let i = 0; i<products.length; i++){
            let productItem = cart.products[i];
            let product = await Product.findOne({_id: productItem.product})
            await Product.findOneAndUpdate({_id: productItem.product}, {stock: product.stock-productItem.quantity, 
                sales: product.sales+productItem.quantity}, {new: true});
            if(product.stock < productItem.quantity) return res.send({message: `There are not enough products, there are ${product.stock} in stock, return to the cart and modify the quantity`});
        }
        await Cart.findOneAndDelete({user: userId})
        let bill = new Bill({user: userId, name: name, nit: nit, products: products, total: cart.total});
        await bill.save();
        return res.status(201).send({message: 'Bill created successfully', bill});
    }catch(err){
        console.error(err);
        return res.status(500).send({message: 'Error creating bill'});;
    }
}
exports.update = async(req, res)=>{
    try{
        let billId = req.params.id;
        let userId = req.user.sub;
        let {name, nit, productId, quantity} = req.body;
        let bill = await Bill.findOne({$and:[{_id: billId}, {user: userId}]})
        if(!bill) return res.send({message: 'Bill not found'});
        if(productId && productId !== ''){
            if(!quantity || quantity == '') return res.send({message: 'You must specify the quantities to be able to update'});
            let product = await Product.findOne({_id: productId});
            let itemIndex = bill.products.findIndex(p=> p.product == productId);
            if(itemIndex > -1){
                let productItem = bill.products[itemIndex];
                if(product.stock < quantity) return res.send({message: `There are not enough products for your requirement, we only have in stock ${product.stock}`});
                if(quantity == 0) {
                    bill.products.splice(itemIndex);
                }else{
                    if(productItem.quantity > quantity){
                        let result = productItem.quantity - parseInt(quantity);
                        await Product.findOneAndUpdate({_id: productItem.product}, {stock: product.stock + result, 
                            sales: product.sales-result}, {new: true});
                    }else if(product.quantity == quantity){

                    }else if(productItem.quantity < quantity){
                        let result = parseInt(quantity)-productItem.quantity;
                        await Product.findOneAndUpdate({_id: productItem.product}, {stock: product.stock-result, 
                            sales: product.sales+result}, {new: true});
                    }
                    productItem.quantity = parseInt(quantity);
                    productItem.subTotal_product = product.price*productItem.quantity;
                    bill.products[itemIndex] = productItem;
                }
            }else {
                return res.send({message: 'This product is not in the cart'});
            }
            bill.total = 0;
            for(let product of bill.products){
                bill.total += product.subTotal_product;
            }
            bill.name = name;
            bill.nit = nit;
            var updateBill = await Bill.findOneAndUpdate({user: userId}, bill, {new: true});
        }else{
            var updateBill = await Bill.findOneAndUpdate({$and:[{_id: billId}, {user: userId}]}, {name, nit}, {new: true});
        }
        return res.status(200).send({message: 'bill updated successfully', updateBill});
    }catch(err){
        console.error(err);
        return res.status(500).send({message: 'Error updating bill'});
    }
}

exports.getMyBills = async(req, res)=>{
    try{
        let userId = req.user.sub;
        let bills = await Bill.find({user: userId});
        if(bills.length == 0) return res.send({message: 'You still dont have invoices'});
        return res.status(200).send({bills});
    }catch(err){
        console.error(err);
        return res.status(500).send({message: 'Error getting bills'});
    }
}

exports.getBill = async(req, res)=>{
    try{
        let userId = req.user.sub;
        let billId = req.params.id;
        let bill = await Bill.findOne({$and:[{_id: billId}, {user: userId}]});
        if(!bill) return res.send({message: 'bill not found'});
        return res.status(200).send({bill});
    }catch(err){
        console.error(err);
        return res.status(500).send({message: 'Error getting bill'})
    }
};
