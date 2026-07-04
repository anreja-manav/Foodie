import { useLocation, Link } from "react-router-dom";

const Breadcrumbs = () => {
    const locations = useLocation();
    const pathnames = locations.pathname.split('/').filter(x => x);

    return (
        <nav className="text-gray-400 my-6 text-[12px]">
            <ul className="flex gap-1">
                <li>
                    <Link  to="/" className="hover:text-blue-700 hover:underline">Home</Link>
                    
                </li>
                {
                    pathnames.map((value, index) =>{
                        const last = index === pathnames.length - 1;
                        const to = `/${pathnames.slice(0, index + 1).join('/')}`;
                        const title = value;
                        return(
                            <li key={to}>
                                <span> / </span>
                                {
                                    last ? (
                                        <span className="text-gray-900">{title}</span>
                                    ): 
                                    (
                                        <Link to={to} className="hover:text-blue-700 hover:underline">{title}</Link>
                                    )
                                }
                            </li>
                        )
                    })
                }
            </ul>
        </nav>
    )
}

export default Breadcrumbs;