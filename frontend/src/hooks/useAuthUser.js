import { useQuery } from "@tanstack/react-query"
import { getAuthUser } from "../lib/api.js";

const useAuthUser = () => {
    const authUser = useQuery({
        queryKey: ['authUser'],
        queryFn: getAuthUser,
        retry: false //tanstack refresh the data three more times if there is error, thinks that if there is server down or something whereas useEffect doesn't and to stop that we can put "retry:false"
    })
    return { isLoading: authUser.isLoading, authUser: authUser.data?.user };
}

export default useAuthUser
