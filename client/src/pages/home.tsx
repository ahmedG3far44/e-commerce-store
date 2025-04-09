// import { useState, useEffect } from "react";
// // import { AiFillAccountBook, AiFillAndroid } from "react-icons/ai";
// import { getAllProducts } from "../utils/handlers"; // Import your API function

// const LandingPage = () => {
//   const [products, setProducts] = useState([]);
//   const [featuredProducts, setFeaturedProducts] = useState([]);
//   const [isLoading, setIsLoading] = useState(true);

//   useEffect(() => {
//     // Fetch all products using your API function
//     console.log(products);
//     const fetchProducts = async () => {
//       try {
//         setIsLoading(true);
//         const data = await getAllProducts();

//         if (data && !data.message) {
//           // Check if data is valid and not an error
//           setProducts(data);

//           // Extract featured products (you can modify this logic based on your data structure)
//           // For example, you might have a 'featured' property in your product objects
//           const featured = data
//             .filter((product: any) => product.featured || product.isNewArrival)
//             .slice(0, 6);
//           setFeaturedProducts(featured);
//         }
//       } catch (error) {
//         console.error("Error fetching products:", error);
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     fetchProducts();
//   }, []);

//   // Placeholder data for categories
//   // const categories = [
//   //   {
//   //     id: 1,
//   //     name: "Gaming Mouse Pads",
//   //     image: "/images/gaming-mousepad.jpg",
//   //     description: "Precision-engineered for gamers",
//   //   },
//   //   {
//   //     id: 2,
//   //     name: "Extended Desk Mats",
//   //     image: "/images/extended-mat.jpg",
//   //     description: "Full desk coverage for your setup",
//   //   },
//   //   {
//   //     id: 3,
//   //     name: "Designer Collections",
//   //     image: "/images/designer-mousepad.jpg",
//   //     description: "Unique patterns for creative professionals",
//   //   },
//   //   {
//   //     id: 4,
//   //     name: "PC Accessories",
//   //     image: "/images/pc-accessories.jpg",
//   //     description: "Complete your workstation",
//   //   },
//   // ];

//   // Placeholder for featured products if API call fails or returns empty
//   const placeholderProducts = [
//     {
//       _id: 1,
//       name: "Pro Gaming Mousepad XL",
//       price: 24.99,
//       image: "/images/product-1.jpg",
//       description: "Low-friction surface for precise control",
//     },
//     {
//       _id: 2,
//       name: "RGB Extended Mousepad",
//       price: 39.99,
//       image: "/images/product-2.jpg",
//       description: "LED lighting with 16.8M colors",
//     },
//     {
//       _id: 3,
//       name: "Ergonomic Wrist Rest Pad",
//       price: 19.99,
//       image: "/images/product-3.jpg",
//       description: "Memory foam support for long sessions",
//     },
//     {
//       _id: 4,
//       name: "Designer Art Collection Pad",
//       price: 29.99,
//       image: "/images/product-4.jpg",
//       description: "Limited edition artist collaboration",
//     },
//     {
//       _id: 5,
//       name: "Cable Management System",
//       price: 14.99,
//       image: "/images/product-5.jpg",
//       description: "Keep your desk clean and organized",
//     },
//     {
//       _id: 6,
//       name: "Mechanical Keyboard Wrist Pad",
//       price: 22.99,
//       image: "/images/product-6.jpg",
//       description: "Perfect height for mechanical keyboards",
//     },
//   ];

//   // Use fetched featured products or fall back to placeholders if none available
//   const displayProducts =
//     featuredProducts.length > 0 ? featuredProducts : placeholderProducts;

//   // Add to cart handler (you'll need to implement this according to your cart system)
//   const handleAddToCart = (productId) => {
//     console.log(`Added product ${productId} to cart`);
//     // Implement your cart logic here
//   };

//   return (
//     <div className="min-h-screen bg-gray-50">
//       {/* Header */}
 

//       {/* Hero Section */}
    

//       {/* Categories */}
      

//       {/* Featured Products */}
     

//       {/* Value Propositions */}


//       {/* Testimonials (optional section) */}
     

//       {/* Newsletter */}
     

//       {/* Footer */}
      
//     </div>
//   );
// };

// export default LandingPage;
