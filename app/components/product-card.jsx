import { Badge } from "@/components/ui/badge"
import Link from "next/link"

 function ProductCard({ product }) {

  // Calculate sale percentage
  const getSalePercentage = () => {
    if (product.discountPrice && product.price && product.price > product.discountPrice) {
      return Math.round(((product.price - product.discountPrice) / product.price) * 100)
    }
    return 0
  }

  const salePercentage = getSalePercentage()

  // return (
  //   <Link href={`/product/${product._id}`}>
  //     <div
  //       className="group bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer"
  //     >
  //       <div className="relative overflow-hidden">
  //         <img
  //           src={product.mainImage.imageUrl}
  //           alt={product.name}
  //           className="w-full h-80 object-cover group-hover:scale-105 transition-transform duration-500"
  //         />

  //         {(salePercentage > 0) && (
  //           <Badge className="absolute top-4 left-4 bg-red-500 text-white">
  //             {salePercentage > 0 ? `-${salePercentage}%` : "Sale"}
  //           </Badge>
  //         )}

  //       </div>

  //       <div className="p-6">
  //         <h3 className="font-semibold text-lg text-gray-900 mb-2 group-hover:text-gray-700 transition-colors">
  //           {product.name}
  //         </h3>
  //         <p className="text-gray-600 text-sm mb-3">{product.category}</p>
  //         <div className="flex items-center justify-between">
  //           <div className="flex items-center space-x-2">
  //             {product.OriginalPrice && product.OriginalPrice !== (product.discountPrice || product.price) && (
  //               <span className="text-gray-400 line-through text-sm">${product.price}</span>
  //             )}
  //             <span className="text-xl font-bold text-gray-900">${product.discountPrice || product.price}</span>
  //           </div>
  //           {product.variants && product.variants.length > 1 && (
  //             <div className="flex space-x-1">
  //               {product.variants.slice(0, 3).map((variant, index) => (
  //                 <div
  //                   key={index}
  //                   className="w-4 h-4 rounded-full border border-gray-300"
  //                   style={{ backgroundColor: variant.colorHex }}
  //                   title={variant.color}
  //                 />
  //               ))}
  //               {product.variants.length > 3 && (
  //                 <span className="text-xs text-gray-500">+{product.variants.length - 3}</span>
  //               )}
  //             </div>
  //           )}
  //         </div>
  //       </div>
  //     </div>
  //   </Link>
  // )
  return (<h1>{ product.name }</h1>)
}

export {ProductCard}