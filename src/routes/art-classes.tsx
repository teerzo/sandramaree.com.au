import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/art-classes')({
  component: ArtClasses,
})

function ArtClasses() {
  return (
    <div className="min-h-screen bg-white py-12 px-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Art Classes</h1>

        <p className="text-lg text-gray-600">
          All in person classes are held at my home studio in <a href="https://maps.app.goo.gl/6YAkpATG1VQW5tLm8" target="_blank" className="text-blue-500 hover:text-blue-700">Crescent Head</a>.
        </p>


        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4 mt-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between gap-4 mb-4">
              <h2 className="text-2xl font-bold text-gray-900">Adult Art Classes</h2>
              <a href="https://forms.gle/GqKg8tsy1FYCk7N18" target="_blank">
                <button className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600">
                  Enroll Now
                </button>
              </a>
            </div>

            <img src="/images/adult.jpg" alt="Adult Art Classes" className="w-full h-48 object-cover rounded-lg mb-4" />
            <ul className="text-gray-600 mb-4">
              <li>$60 for a one hour drawing lesson</li>
              <li>$100 for an hour and half lesson.</li>
              <li>$180 for two x one hour and half lessons</li>
            </ul>
            <p className="text-gray-600 mb-4">Material fee is extra, prices vary according to medium used.</p>
            <p className="text-gray-600 mb-4">Instruction is given in a variety of mediums, drawing, conte, pastels, watercolour pencils, and watercolours., tailored to suit your creative interests and provide skill development.</p>
            {/* <p className="text-gray-600 mb-4">Lessons at my home studio Crescent Head</p> */}


          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between gap-4 mb-4">
              <h2 className="text-2xl font-bold text-gray-900">Kids and Teen Art Lessons</h2>

              <a href="https://forms.gle/s2HKXYcWizMJoVJe6" target="_blank">
                <button className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600">
                  Enroll Now
                </button>
              </a>
            </div>
            <img src="/images/kids.jpg" alt="Kids and Teen Art Lessons" className="w-full h-48 object-cover rounded-lg mb-4" />
            <ul className="text-gray-600 mb-4">
              <li>1 private one hour lesson $50</li>
              <li>1 private one hour lesson free with  $50 Kids Voucher</li>
            </ul>
            <p className="text-gray-600 mb-4">Instruction is given in a variety of mediums, drawing, conte, pastels, watercolour pencils, and watercolours and tailored to suit your child's interest and skills.</p>
            <p className="text-gray-600 mb-4">I supply all materials drawing, watercolour, watercolour paper.</p>

          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between gap-4 mb-4">
              <h2 className="text-2xl font-bold text-gray-900">Creative kids vouchers</h2>

              <a href="https://forms.gle/s2HKXYcWizMJoVJe6" target="_blank">
                <button className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600">
                  Apply here
                </button>
              </a>
            </div>
            <img src="/images/kids.jpg" alt="Kids and Teen Art Lessons" className="w-full h-48 object-cover rounded-lg mb-4" />

            <p className="text-gray-600 mb-4">
              I am registered provider for Service NSW, Creative Kids Vouchers. <br/> <br/>

              These can be used for face to face and also my online art lessons.
            </p>

          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between gap-4 mb-4">
              <h2 className="text-2xl font-bold text-gray-900">Private Lessons</h2>

              <a href="https://forms.gle/s2HKXYcWizMJoVJe6" target="_blank">
                <button className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600">
                  Enroll Now
                </button>
              </a>
            </div>
            <img src="/images/kids.jpg" alt="Kids and Teen Art Lessons" className="w-full h-48 object-cover rounded-lg mb-4" />
            <ul className="text-gray-600 mb-4">
              <li>1 private one hour lesson $50</li>
              <li>1 private one hour lesson free with  $50 Kids Voucher</li>
            </ul>
            <p className="text-gray-600 mb-4">Instruction is given in a variety of mediums, drawing, conte, pastels, watercolour pencils, and watercolours and tailored to suit your child's interest and skills.</p>
            <p className="text-gray-600 mb-4">I supply all materials drawing, watercolour, watercolour paper.</p>

          </div>
        </div>
      </div>
    </div >
  )
}

