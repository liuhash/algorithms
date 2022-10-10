import requests from "../utils/requests";
export function getChannels()
{
    return requests.get("/channels")
}