import React from "react";

export default function Footer() {
  return (
    <div>
      <footer className="bg-body-tertiary">
        <div className="container p-4">
          <section className="mb-4">
            <a className="btn btn-outline btn-floating m-1" href="#!" role="button">
              <i className="fab fa-facebook-f"></i>
            </a>
            <a className="btn btn-outline btn-floating m-1" href="#!" role="button">
              <i className="fab fa-twitter"></i>
            </a>
            <a className="btn btn-outline btn-floating m-1" href="#!" role="button">
              <i className="fab fa-google"></i>
            </a>
            <a className="btn btn-outline btn-floating m-1" href="#!" role="button">
              <i className="fab fa-instagram"></i>
            </a>
            <a className="btn btn-outline btn-floating m-1" href="#!" role="button">
              <i className="fab fa-linkedin-in"></i>
            </a>
            <a className="btn btn-outline btn-floating m-1" href="#!" role="button">
              <i className="fab fa-github"></i>
            </a>
          </section>

          <section className="">
            <form action="">
              <div className="row d-flex justify-content-center">
                <div className="col-auto">
                  <p className="pt-2">
                    <strong>Sign up for our newsletter</strong>
                  </p>
                </div>

                <div className="col-md-5 col-12">
                  <div data-mdb-input-init className="form-outline mb-4">
                    <input
                      type="email"
                      id="form5Example24"
                      className="form-control"
                    />
                    <label className="form-label" htmlFor="form5Example24">
                      Email address
                    </label>
                  </div>
                </div>

                <div className="col-auto">
                  <button type="submit" className="btn btn-outline mb-4">
                    Subscribe
                  </button>
                </div>
              </div>
            </form>
          </section>

          <section className="mb-4">
            <p>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Sunt
              distinctio earum repellat quaerat voluptatibus placeat nam,
              commodi optio pariatur est quia magnam eum harum corrupti dicta,
              aliquam sequi voluptate quas.
            </p>
          </section>

          <section className="">
            <div className="row d-flex justify-content-center align-content-center">
              <div className="col-lg-4 col-md-6 mb-4 mb-md-0">
                <h5 className="text-uppercase">Pages</h5>

                <ul className="list-unstyled mb-0">
                  <li>
                    <a className="text-body" href="#!">
                      Home
                    </a>
                  </li>
                  <li>
                    <a className="text-body" href="#!">
                      Collection
                    </a>
                  </li>
                  <li>
                    <a className="text-body" href="#!">
                      Item
                    </a>
                  </li>
                </ul>
              </div>

              <div className="col-lg-4 col-md-6 mb-4 mb-md-0">
                <h5 className="text-uppercase">Categories</h5>

                <ul className="list-unstyled mb-0">
                  <li>
                    <a className="text-body" href="#!">
                      Books
                    </a>
                  </li>
                  <li>
                    <a className="text-body" href="#!">
                      Coins
                    </a>
                  </li>
                  <li>
                    <a className="text-body" href="#!">
                      Tools
                    </a>
                  </li>
                </ul>
              </div>

              <div className="col-lg-4 col-md-6 mb-4 mb-md-0">
                <h5 className="text-uppercase">Tags</h5>

                <ul className="list-unstyled mb-0">
                  <li>
                    <a className="text-body" href="#!">
                      Link 1
                    </a>
                  </li>
                  <li>
                    <a className="text-body" href="#!">
                      Link 2
                    </a>
                  </li>
                  <li>
                    <a className="text-body" href="#!">
                      Link 3
                    </a>
                  </li>
                  <li>
                    <a className="text-body" href="#!">
                      Link 4
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </section>
        </div>

        <div className="text-center p-3 bg-dark-subtle" >
          © 2020 Copyright:
          <a className="text-reset fw-bold" href="https://mdbootstrap.com/">
            MDBootstrap.com
          </a>
        </div>
      </footer>
    </div>
  );
}
