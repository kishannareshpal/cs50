import qs from 'query-string';
import { useLocation } from 'react-router-dom';

/**
 * A custom hook that builds on useLocation to parse
 * the query string.
 * @returns an object containing all available query strings in current url.
 **/
function useQuery() {
    return qs.parse(useLocation().search);
}

export default useQuery;