
function Footer()  {
    return (
        <footer className="bg-gray-800 text-white py-4">
            <div className="container mx-auto px-4">
                <p className="text-center">&copy; {new Date().getFullYear()} ReserveNRate. All rights reserved.</p>
                <nav className="mt-4">
                    <ul className="flex justify-center space-x-4">
                        <li><a href="/terms" className="hover:underline">Terms of Service</a></li>
                        <li><a href="/privacy" className="hover:underline">Privacy Policy</a></li>
                        <li><a href="/contact" className="hover:underline">Contact Us</a></li>
                    </ul>
                </nav>
            </div>
        </footer>
    );
};

export default Footer;