import { useContext, useState } from "react";
import { ProductsContext } from "../../contexts/ProductsContext";
import { SORT_ITEMS } from "../../utils/actionTypes";
import instance from "../../utils/api";
import Swal from "sweetalert2";

const SortItems = () => {
    const { sorted, categories, productsDispatch } =
        useContext(ProductsContext);

    const handleChange = (e) => {
        if (e.target.value === "default") {
            instance
                .get("/products")
                .then((res) => {
                    const excludedElectronics = res.data.filter(
                        (item) => item.category !== "electronics"
                    );
                    // Filter products based on selected categories
                    const filteredProducts = excludedElectronics.filter(
                        (product) =>
                            categories.some(
                                (category) =>
                                    category.label === product.category &&
                                    category.isChecked
                            )
                    );
                    productsDispatch({
                        type: SORT_ITEMS,
                        payload: {
                            sortBy: "default",
                            products: filteredProducts.map((prevProduct) => ({
                                ...prevProduct,
                                visible: true,
                            })),
                        },
                    });
                })
                .catch(() => {
                    Swal.fire({
                        icon: "error",
                        title: "Oops...",
                        text: "Something went wrong!",
                        // footer: '<a href="#">Why do I have this issue?</a>'
                      });
                })
        } else {
            productsDispatch({
                type: SORT_ITEMS,
                payload: {
                    sortBy: e.target.value,
                },
            });
        }
    };

    return (
        <div>
            <label>
                Sort by:
                <select value={sorted} onChange={handleChange}>
                    <option value={"default"}>Default</option>
                    <option value={"ascending"}>
                        Price &#40;low to hight&#41;
                    </option>
                    <option value={"descending"}>
                        Price &#40;high to low&#41;
                    </option>
                </select>
            </label>
        </div>
    );
};

export default SortItems;