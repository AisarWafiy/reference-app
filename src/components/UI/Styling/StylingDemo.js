import React from 'react'

const StylingDemo = () => {
  return (
    <div className='container'>
      <br />
      <h1>This is a H1 element</h1>
      <h2>This is a H2 element</h2>
      <h3>This is a H3 element</h3>
      <h4>This is a H4 element</h4>
      <h5>This is a H5 element</h5>
      <h6>This is a H6 element</h6>
      <br />
      <form>
        <div className='form-group'>
          <label for='exampleFormControlInput1'>Email address</label>
          <input
            type='email'
            className='form-control'
            id='exampleFormControlInput1'
            placeholder='name@example.com'
          />
        </div>
        <div className='form-group'>
          <label for='exampleFormControlSelect1'>Example select</label>
          <select className='form-control' id='exampleFormControlSelect1'>
            <option>1</option>
            <option>2</option>
            <option>3</option>
            <option>4</option>
            <option>5</option>
          </select>
        </div>

        <div className='form-group'>
          <label for='inputPassword6'>Password</label>
          <input
            type='password'
            id='inputPassword6'
            className='form-control col-4'
            aria-describedby='passwordHelpInline'
          />
          <small id='passwordHelpInline' className='text-muted'>
            Must be 8-20 characters long.
          </small>
        </div>

        <br />

        <div className='form-group'>
          <select className='custom-select' id='validationServer04' required>
            <option selected disabled value=''>
              Choose...
            </option>
            <option>...</option>
            <option>!!!</option>
            <option>???</option>
            <option>///</option>
          </select>
        </div>

        <div className='form-group'>
          <label for='exampleFormControlTextarea1'>Example textarea</label>
          <textarea className='form-control' id='exampleFormControlTextarea1' rows='3'></textarea>
        </div>

        <div className='form-row'>
          <div className='col-md-6 mb-3'>
            <label for='validationServer01' className='form-label'>
              First name
            </label>
            <input
              type='text'
              className='form-control is-valid'
              id='validationServer01'
              value='Mark'
              required
            />
            <div className='valid-feedback'>Looks good!</div>
          </div>
          <div className='col-md-6 mb-3'>
            <label for='validationServer02' className='form-label'>
              Last name
            </label>
            <input
              type='text'
              className='form-control is-valid'
              id='validationServer02'
              value='Otto'
              required
            />
            <div className='valid-feedback'>Looks good!</div>
          </div>
        </div>
        <div className='form-row'>
          <div className='col-md-6 mb-3'>
            <label for='validationServer03' className='form-label'>
              City
            </label>
            <input
              type='text'
              className='form-control is-invalid'
              id='validationServer03'
              required
            />
            <div className='invalid-feedback'>Please provide a valid city.</div>
          </div>
          <div className='col-md-3 mb-3'>
            <label for='validationServer04' className='form-label'>
              State
            </label>
            <select className='custom-select is-invalid' id='validationServer04' required>
              <option selected disabled value=''>
                Choose...
              </option>
              <option>...</option>
            </select>
            <div className='invalid-feedback'>Please select a valid state.</div>
          </div>
          <div className='col-md-3 mb-3'>
            <label for='validationServer05' className='form-label'>
              Zip
            </label>
            <input
              type='text'
              className='form-control is-invalid'
              id='validationServer05'
              required
            />
            <div className='invalid-feedback'>Please provide a valid zip.</div>
          </div>
        </div>
        <div className='form-group'>
          <div className='custom-control custom-checkbox'>
            <input
              className='custom-control-input '
              type='checkbox'
              value=''
              id='invalidCheck3'
              required
            />
            <label className='custom-control-label' for='invalidCheck3'>
              Agree to terms and conditions
            </label>
            <div className='invalid-feedback'>You must agree before submitting.</div>
          </div>
        </div>

        {/* <div className='custom-control custom-checkbox'>
          <input type='checkbox' className='custom-control-input' id='customCheck1we' />
          <label className='custom-control-label' for='customCheck1we'>
            Check this custom checkbox
          </label>
        </div> */}

        <br />

        <div className='custom-control custom-radio'>
          <input
            type='radio'
            id='customRadio1'
            name='customRadio'
            className='custom-control-input'
          />
          <label className='custom-control-label' for='customRadio1'>
            Toggle this custom radio
          </label>
        </div>
        <div className='custom-control custom-radio'>
          <input
            type='radio'
            id='customRadio2'
            name='customRadio'
            className='custom-control-input'
          />
          <label className='custom-control-label' for='customRadio2'>
            Or toggle this other custom radio
          </label>
        </div>

        <br />

        <button type='button' className='btn btn-primary btn-lg btn-block'>
          Block level button
        </button>
        <button type='button' className='btn btn-secondary btn-lg btn-block'>
          Block level button
        </button>

        <button type='submit' className='btn btn-primary mr-3 mt-4'>
          Submit
        </button>
        <button type='submit' className='btn btn-outline-secondary mr-3 mt-4'>
          Cancel
        </button>
        <button type='submit' className='btn btn-primary mr-3 mt-4 disabled'>
          Submit
        </button>
        <button type='submit' className='btn btn-outline-secondary mr-3 mt-4 disabled'>
          Cancel
        </button>
        <button type='submit' className='btn btn-success mr-3 mt-4'>
          Submit
        </button>
        <button type='submit' className='btn btn-outline-success mt-4'>
          Cancel
        </button>
      </form>
      <br />
      <br />
      <br />
      <nav aria-label='Page navigation example'>
        <ul class='pagination'>
          <li class='page-item'>
            <a class='page-link' href='#'>
              Previous
            </a>
          </li>
          <li class='page-item'>
            <a class='page-link' href='#'>
              1
            </a>
          </li>
          <li class='page-item'>
            <a class='page-link' href='#'>
              2
            </a>
          </li>
          <li class='page-item'>
            <a class='page-link' href='#'>
              3
            </a>
          </li>
          <li class='page-item'>
            <a class='page-link' href='#'>
              Next
            </a>
          </li>
        </ul>
      </nav>
    </div>
  )
}

export default StylingDemo
