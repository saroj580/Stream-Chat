import NavBar from "./NavBar.jsx"
import SideBar from "./SideBar.jsx"

const Layout = ({children, showSideBar = false}) => {
    return (
        <div className="min-h-screen">
            <div className="flex">
                {
                    showSideBar && <SideBar />
                }
                <div className="flex flex-1 flex-col">
                    <NavBar />
                    <main className="flex-1 overflow-y-auto">
                        {children}
                    </main>
                </div>
            </div>
        </div>
    )
}

export default Layout
