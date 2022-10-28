import requests from "../utils/requests";
export const getArticles=(params)=>{
    return requests({
        url:'/mp/articles',
        method:"get",
        params,
    })
}
export const delArticles=(id)=>{
    return requests.delete(`/mp/articles/${id}`)
}
export const addArticles=(data,draft=false)=>{
    return requests({
        url:`/mp/articles?draft=${draft}`,
        method:"post",
        data
    })
}
export const getArticleById=(id)=>{
    return requests.get(`/mp/articles/${id}`)
}
export const updateArticle=(data,draft)=>{
    return requests({
        url:`/mp/articles/${data.id}?draft=${draft}`,
        method:'PUT',
        data
    })
}