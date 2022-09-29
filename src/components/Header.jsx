import snap_logo from "./assets/snap_raise_logo.png";

export default function Header() {
	return (
		<nav className="navbar bg-primary mb-4 p-0">
			<div className="container">
				<a className="navbar-brand" href='/'>
					<div className="d-flex">
						<img src={snap_logo} alt="snap_logo" className="mr-2" />
						<div className="header-text">SNAP! Manage iCal</div>
					</div>
				</a>
			</div>
		</nav>
	)
}

