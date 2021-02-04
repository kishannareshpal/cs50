import qs from 'query-string';
import { useLocation } from 'react-router-dom';

/**
 * A custom hook that builds on useLocation to parse
 * the query string.
 * 
 **/
function useQuery() {
    return qs.parse(useLocation().search)
}

export default useQuery