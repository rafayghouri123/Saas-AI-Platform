import { useCallback, useEffect, useRef } from "react";



interface useInfiniteScrollProps{
    status: "LoadingFirstPage" | "CanLoadMore" | "LoadingMore" | "Exhausted",
    loadMore:(numItems:number)=>void;
    loadSize?:number;
    observerEnabled?:boolean

}

export const useInfiniteScroll=({status,loadMore,loadSize=10,observerEnabled=true}:useInfiniteScrollProps)=>{
    const topElementRef = useRef<HTMLDivElement>(null)


    const handleLoadmore = useCallback(()=>{
        if(status==="CanLoadMore"){
            loadMore(loadSize);
        }
    },[status,loadMore,loadSize])

    useEffect(()=>{
        const topElement = topElementRef.current

        if(!(topElement&&observerEnabled)){
            return
        }

        const observer = new IntersectionObserver(([entry])=>{
            if(entry?.isIntersecting){
                handleLoadmore()
            }
        },{threshold:0.1})

        observer.observe(topElement)

        return()=>{
            observer.disconnect()
        }

        
    },[handleLoadmore,observerEnabled])

    return{
        topElementRef,
        handleLoadmore,
        canLoadMore:status === "CanLoadMore",
        isLoadingMore:status === "LoadingMore",
        isLoadingFirstPage:status === "LoadingFirstPage",
        isExhausted:status ==="Exhausted"
    }
}