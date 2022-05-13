import {useShopQuery, useRouteParams, Image} from '@shopify/hydrogen';
import gql from 'graphql-tag';

import Layout from '../../components/Layout.server';

const dummyLocation = {
  featured_image: {
    url: 'https://cdn.shopify.com/s/files/1/0551/4566/0472/files/toronto-office_800x600_crop_center.jpg?v=1652456367',
    width: 800,
    height: 600,
    altText: 'Image of Toronto Location',
  },
  title: 'Toronto',
  address: '620 King St W, \nToronto, ON \nM5V 1M7',
  directions_link: 'https://goo.gl/maps/1gpmaPVNQvvurziG6',
  hours: ['Monday - Saturday: 11am - 6pm', 'Sunday: 12pm - 6pm'],
  email: 'toronto@snowdevil.ca',
  phone: '647-424-1234',
};

export default function Location() {
  const location = dummyLocation;

  const {handle} = useRouteParams();
  const {data} = useShopQuery({
    query: QUERY,
    variables: {
      handle,
    },
    preload: true,
  });

  const {featured_image, title, address, directions_link, hours, email, phone} =
    data.metaobject;

  return (
    <Layout>
      <section className="flex flex-col items-center gap-12 pb-16 md:flex-row">
        <Image
          className="object-fill w-full md:w-1/2 md:aspect-[2/3] lg:aspect-square aspect-square"
          width={1000}
          height={1000}
          data={featured_image.reference.image}
        />
        <div className="grid w-full gap-8 md:w-1/2">
          <h1 className="text-2xl">{title.value}</h1>
          <div className="flex flex-col gap-8 md:flex-row">
            <div className="grid gap-8">
              <div className="grid gap-2">
                <h3 className="font-bold">Address</h3>
                <address
                  className="not-italic"
                  dangerouslySetInnerHTML={{
                    __html: address.value.replace(/(?:\r\n|\r|\n)/g, '<br/>'),
                  }}
                />
                <a
                  className="underline"
                  href={directions_link.value}
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  Get directions
                </a>
              </div>
              <div className="grid gap-2">
                <h3 className="font-bold">Contact us:</h3>
                <a className="underline" href={`tel:${phone.value}`}>
                  {phone.value}
                </a>
                <a className="underline" href={`mailto:${email.value}`}>
                  {email.value}
                </a>
              </div>
            </div>
            <div className="flex flex-col items-start gap-2">
              <h3 className="font-bold">Hours</h3>
              <ul>
                {JSON.parse(hours.value).map((hour, i) => (
                  <li key={i}>{hour}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}

const QUERY = gql`
  query location($handle: String!) {
    metaobject(byHandle: {type: "locations", handle: $handle}) {
      id
      featured_image: field(key: "featured_image") {
        reference {
          ... on MediaImage {
            image {
              url
              width
              height
            }
          }
        }
      }
      title: field(key: "title") {
        value
      }
      address: field(key: "address") {
        value
      }
      directions_link: field(key: "directions_link") {
        value
      }
      hours: field(key: "hours") {
        value
      }
      email: field(key: "email") {
        value
      }
      phone: field(key: "phone") {
        value
      }
    }
  }
`;
