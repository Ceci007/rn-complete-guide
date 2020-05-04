import Product from "../../models/product";

export const DELETE_PRODUCT = "DELETE_PRODUCT";
export const CREATE_PRODUCT = "CREATE_PRODUCT";
export const UPDATE_PRODUCT = "UPDATE_PRODUCT";
export const SET_PRODUCTS = "SET_PRODUCTS";

export const fetchProducts = () => {
  return async (dispatch, getState) => {
    const userId = getState().auth.userId;
    try {
      const response = await fetch("https://rn-complete-guide-155d6.firebaseio.com/products.json");

      if(!response.ok) {
        throw new Error('Something went wrong!');
      }

      const resData = await response.json();
      const loadedProducts = [];

      for(const key in resData) {
        loadedProducts.push(new Product(key, resData[key].ownerId, resData[key].title, resData[key].imageUrl, resData[key].price, resData[key].description));
      }

      dispatch({type: SET_PRODUCTS, products: loadedProducts, userProducts: loadedProducts.filter(prod => prod.ownerId === userId)});
    } catch(err) {
      throw err;
    }
  }
}

export const deleteProduct = (productId) => {
  return async (dispatch, getState) => {
    const token = getState().auth.token;
    const response = await fetch(`https://rn-complete-guide-155d6.firebaseio.com/products/${productId}.json?access_token=${token}`, {
      method: "DELETE",
    });

    if(!response.ok) {
      throw new Error('something went wrong!');
    }

    dispatch({ type: DELETE_PRODUCT, pid: productId });
  }
};

export const createProduct = (title, description, imageUrl, price) => {
  return async (dispatch, getState) => {
    const token = getState().auth.token;
    const userId = getState().auth.userId;
    const response = await fetch(`https://rn-complete-guide-155d6.firebaseio.com/products.json?access_token=${token}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title, 
        description, 
        imageUrl, 
        price,
        ownerId: userId
      })
    });

    const resData = await response.json();

    dispatch({
      type: CREATE_PRODUCT,
      productData: {
        id: resData.name,
        title,
        description,
        imageUrl,
        price,
        ownerId: userId,
      } 
    });
  }
};

export const updateProduct = (id, title, description, imageUrl) => {
  return async (dispatch, getState) => {
   const token = getState().auth.token;
   const response = await fetch(`https://rn-complete-guide-155d6.firebaseio.com/products/${id}.json?access_token=${token}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title, 
        description,
        imageUrl,
      })
    });

    if(!response.ok) {
      throw new Error('something went wrong!');
    }

    dispatch({
      type: UPDATE_PRODUCT,
      pid: id,
      productData: {
        title,
        description,
        imageUrl,
      },
    });
  }
};

