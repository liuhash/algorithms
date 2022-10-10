import requests from "../utils/requests";
export const getArticles=(params)=>{
    return requests({
        url:'/mp/articles',
        method:"get",
        params,
    })
}