import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/about')({
    component: About,
})

function About() {
    return (
        <div className="min-h-screen bg-white py-12 px-6">
            <div className="max-w-7xl mx-auto">
                {/* <h1 className="text-4xl font-bold text-gray-900 mb-8">About</h1> */}

                <div className="flex flex-row gap-10 mt-10">
                    <div className="hidden md:flex flex-col gap-2">
                        <a href="#about" className="text-gray-700 hover:text-gray-900"> About</a>
                        <a href="#solo" className="text-gray-700 hover:text-gray-900"> Solo Exhibitions</a>
                        <a href="#group" className="text-gray-700 hover:text-gray-900"> Group Exhibitions</a>
                        <a href="#commissions" className="text-gray-700 hover:text-gray-900"> Commissions</a>
                        <a href="#publications" className="text-gray-700 hover:text-gray-900"> Publications </a>
                        <a href="#reviews" className="text-gray-700 hover:text-gray-900"> Reviews </a>
                        <a href="#representation" className="text-gray-700 hover:text-gray-900"> Representation </a>
                        <a href="#education" className="text-gray-700 hover:text-gray-900"> Education </a>

                    </div>
                    <div className="flex flex-col gap-4">

                        <div className="flex flex-col gap-2" id="about">
                            <h1 className="text-4xl font-bold text-gray-900 mb-8">About</h1>
                            <div className="flex flex-col items-center gap-10 lg:flex-row">
                                <img src="/images/sandra.jpg" alt="Sandra Maree" className="w-full max-w-64 object-cover rounded-lg mb-4" />

                                <div className="flex flex-col gap-4">
                                    <p>
                                        I create from stillness-- <br />
                                        where beauty is not just seen, but felt. <br />
                                        My paintings are invitations to pause, to soften, and to listen within.
                                    </p>

                                    <p>
                                        Through feminine figures, light-infused landscapes, and the quiet between forms, <br />
                                        I explore the spaces where the seen meets the unseen-- <br />
                                        where soul rises gently to the surface.
                                    </p>

                                    <p>
                                        My work is not about portraying life as it appears, <br />
                                        but as it feels when we are deeply present.
                                    </p>
                                    <p>
                                        May my art be a doorway-- <br />
                                        back to the essence we never truly left.
                                    </p>
                                </div>
                            </div>
                        </div>


                        <div className="flex flex-col gap-2" id="solo">
                            <h1 className="text-4xl font-bold text-gray-900 mb-8">Solo Exhibitions</h1>


                            <ul className="list-disc list-inside tabular-nums">

                                <li>2020 - 'Coastal'  online exhibition with 'The Exhibit'</li>
                                <li>2016 - 'Immersion' Hardys Bay Club, Hardys Bay.</li>
                                <li>2014 - 'Voyage', Art Studios Gallery. North Gosford</li>
                                <li>2012 - 'Mare e Cielo' Hang- Nicole Ruiz Gallery, Brooklyn</li>
                                <li>2010 - 'How can I be substantial if I fail to cast a shadow?' Gosford Regional Gallery</li>
                                <li>2007 - 'After Siddhartha'   Gnostic Mana Café , Woy Woy</li>
                                <li>2004 - 'Sea Visions' Gosford Regional Gallery</li>
                                <li>2003 - Solo Exhibition, Shorethyme Restaurant, Norah Head</li>
                            </ul>

                        </div>

                        <div className="flex flex-col gap-2" id="group">

                            <h1 className="text-4xl font-bold text-gray-900 mb-8">Group Exhibitions</h1>

                            <ul className="list-disc list-inside tabular-nums">

                                <li>2022 - International Women's Day : Gladstone</li>
                                <li>2018 - Finalist Gosford City Art Prize</li>
                                <li>2014 - TransformARTive, Art Studios Gallery, North Gosford</li>
                                <li>2013 - ‘The story of the Creatives’ New York</li>
                                <li>2012 - ‘Burnt’ The Incinerator Art Space Willoughby</li>
                                <li>2012 - ‘Art Takes Times Square, New York </li>
                                <li>2011 - ‘On the Edge’Trevisan International Art, Galleriea De’Marchi, Bologna, Italy </li>
                                <li>2011 - Hornsby Tafe 2011 Graduation Exhibition</li>
                                <li>2011 - Central Coast Grammar School, Erina Heights</li>
                                <li>2011 - 5 Lands Walk, Avoca Beach Surf Club     </li>
                                <li>2010 - Hornsby Tafe 2010 Exhibition</li>
                                <li>2009 - Every picture tells a story’, Gosford Regional Gallery</li>
                                <li>2009 - ‘Persistence of Form”, New York</li>
                                <li>2007 - Central Coast Art Society Exhibition, Gosford Gallery  </li>
                                <li>2006 - Mangrove Mountain Art and Craft Show 1st prize  </li>
                                <li>2006 - Canberra Times Outdoor Art Show</li>
                                <li>2006 - Canberra Show, Canberra</li>
                                <li>2005 - Canberra Artist Society Show , Canberra              </li>
                                <li>2004 - Canberra Times Art Show, Canberra                     </li>
                                <li>2003 - Central Coast Art Society Exhibition, Gosford Gallery</li>
                                <li>2003 - Hills Grammar School Exhibition, Dural                            </li>
                                <li>2002 - Gosford City Art Prize Competition, Gosford</li>
                            </ul>
                        </div>

                        <div className="flex flex-col gap-2" id="commissions">

                            <h1 className="text-4xl font-bold text-gray-900 mb-8">Commissions</h1>

                            <p>Works have also been purchased by local and interstate collectors through private sales and commissions. </p>

                        </div>

                        <div className="flex flex-col gap-2" id="publications">
                            <h1 className="text-4xl font-bold text-gray-900 mb-8">Publications</h1>
                            <ul className="list-disc list-inside tabular-nums">
                                <li>2012 - ‘Art Takes Times Square’ See Me Group Inc </li>
                                <li>2012 - ‘Eyes on Landscape’ Blaze Hill Press 2012 (available at Amazon.)</li>
                            </ul>
                        </div>

                        <div className="flex flex-col gap-2" id="reviews">

                            <h1 className="text-4xl font-bold text-gray-900 mb-8">Reviews</h1>

                            <ul className="list-disc list-inside tabular-nums">
                                <li>2009 - 7th July 2009   Press Exposure.com ‘Sandra McArthur’s Works Offer Faceted Ways of   Seeing the Same Object in The Persistence of Form at Agora Gallery’     http://pressexposure.com/Sandra McArthur’s Works Offer Faceted Ways  of Seeing the Same Object in The Persistence of Form at Agora Gallery 74690.html</li>
                                <li>2009 - 7th July 2009  Australians Abroad.com ‘Sandra McArthur-New York August Tuesday 4th’ http://www.australiansabroad.com/cal/viewEvent.cfm?eventid=2906</li>

                            </ul>


                        </div>

                        <div className="flex flex-col gap-2" id="representation">

                            <h1 className="text-4xl font-bold text-gray-900 mb-8">Representation</h1>

                            <ul className="list-disc list-inside tabular-nums">
                                <li>2023 to present - Big Wednesday Art Studio, Crescent Head</li>
                                <li>2016 to 2018 - KAB Gallery, Terrigal</li>
                                <li>2016 to 2017 - Member of 5 Land’s Art Trail, Central Coast NSW</li>
                                <li>2009 to 2010 - Agora Gallery, 530 West 25th Street New York, NY USA</li>
                                <li>2011 to 2012 - Trevisan International Art, Italy</li>
                            </ul>
                        </div>

                        <div className="flex flex-col gap-2" id="education">

                            <h1 className="text-4xl font-bold text-gray-900 mb-8">Education</h1>
                            <ul className="list-disc list-inside tabular-nums"> 
                                <li>2018 - Arts Therapy: Arts Therapy for Self Healing:      Renaissance Life Therapies Training Academy</li>
                                <li>2015- 2016 - Private art tuition with artist Graeme Balchin</li>
                                <li>2015 - Art and Activity: Interactive Strategies for Engaging in Art:  Moma NY</li>
                                <li>2010-2011 - Diploma in Fine Arts, Tafe NSW Hornsby Campus</li>
                                <li>2007 - Certificate iv  Small Business  Management</li>
                                <li>1986-1987 - Private art tuition with artist John Brophy</li>
                                <li>1984 - Diploma in Primary Education majoring in Art , Kuringai College of Advanced Education</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div >
    )
}

