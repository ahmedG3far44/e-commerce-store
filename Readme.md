# Models

1- User
    - one to one relation with Cart
    - one to many relation with Order

    - User Actions:
        - add products to cart
        - remove product from cart
        - clear cart
        - update products items
        - checkout
        - get order history
        - search through products

2- Product
    - one to many relation with Cart
    - one to many relation with Order

3- Cart 
    - one to one relation with Cart

4- Order 
    - one to many relation with Order

# Additional Models:

5- Category
6- Addresses
