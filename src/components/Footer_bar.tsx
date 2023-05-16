
export function FooterBar() {
  return (
    <div> {/*className="flex flex-col min-h-screen"*/}
      <br />
      <br />
      <footer className="footer footer-left p-4 bg-base-100 text-base-content border-t box-shadow mb-3">{/* mt-auto*/}
        <div>

          <p>© {new Date().getFullYear()} - Lost Videogames -
            <a className="link link-hover text-sky-700" href="/About"> About</a>
          </p>

        </div>
      </footer>
    </div>
  )
}