import {
  useShop,
  useShopQuery,
  Seo,
  useRouteParams,
  Image,
} from '@shopify/hydrogen';
import gql from 'graphql-tag';
import title from 'title';
import ProductDetails from '../../components/ProductDetails.client';
import NotFound from '../../components/NotFound.server';
import Layout from '../../components/Layout.server';

export default function Product({country = {isoCode: 'US'}}) {
  const {handle} = useRouteParams();

  const features = [
    {
      id: '2345',
      heading: 'Bend',
      tagline: 'Ultra-flex Camber',
      description:
        'A Camber Bend advocates powerful turns and poppy precision, offering snappy suspension with weight distributed evenly across the entire board for smooth, continuous edge control from tip to tail',
      featured_image: {
        id: '1',
        url: 'https://cdn.shopify.com/s/files/1/0551/4566/0472/files/mattias-olsson-nQz49efZEFs-unsplash_800x.jpg?v=1652462620',
        width: 800,
        height: 600,
        altText: 'Image of a snowboarder',
      },
    },
    {
      id: '3456',
      heading: 'Shape',
      tagline: 'Directional Shape',
      description:
        'Directional Shape is the classic snowboard shape, designed to be ridden with a slightly longer nose than tail to concentrate pop in the tail while providing plenty of float, flow, and control to rip any terrain or condition.',
      featured_image: {
        id: '1',
        url: 'https://cdn.shopify.com/s/files/1/0551/4566/0472/files/dane-deaner-j5asemKMmQY-unsplash_430x.jpg?v=1652462669',
        width: 800,
        height: 600,
        altText: 'Image of a snowboarder',
      },
    },
  ];

  function isOdd(num) {
    return num % 2 === 1 ? true : false;
  }

  const {languageCode} = useShop();

  const {
    data: {product},
  } = useShopQuery({
    query: QUERY,
    variables: {
      country: country.isoCode,
      language: languageCode,
      handle,
    },
    preload: true,
  });

  if (!product) {
    return <NotFound />;
  }

  // This is how a reference array query *will* work
  // references(first: 5) {
  //   edges {
  //     node {
  //       ... on Metaobject {
  //         heading: field(key: "heading") {
  //           value
  //         }
  //         tagline: field(key: "tagline") {
  //           value
  //         }
  //         description: field(key: "description") {
  //           value
  //         }
  //         featured_image: field(key: "featured_image") {
  //           value
  //         }
  //       }
  //     }
  //   }
  // }

  return (
    <Layout>
      <Seo type="product" data={product} />
      <ProductDetails product={product} />
      <KeyFeature feature={product.key_feature} flip={isOdd(1)} />
      <section>
        {features.map(
          ({id, heading, tagline, description, featured_image}, i) => (
            <div
              key={id}
              className={`flex flex-col ${
                isOdd(i) ? 'md:flex-row' : 'md:flex-row-reverse'
              } md:justify-center gap-4 p-6 md:gap-8 md:p-12`}
            >
              <Image
                className={`object-cover w-full md:w-1/2 aspect-[4/3]`}
                width={featured_image.width}
                height={featured_image.height}
                src={featured_image.url}
              />

              <div className="flex flex-col items-start justify-center w-full gap-4 md:w-1/2">
                <h4 className="text-base font-bold uppercase">{heading}</h4>
                <h3 className="text-3xl font-bold">{title(tagline)}</h3>
                <p className="text-base">{description}</p>
              </div>
            </div>
          ),
        )}
      </section>
    </Layout>
  );
}

function KeyFeature({feature, flip}) {
  const {heading, tagline, description, featured_image} = feature.reference;
  return (
    <div
      className={`flex flex-col ${
        flip ? 'md:flex-row' : 'md:flex-row-reverse'
      } md:justify-center gap-4 p-6 md:gap-8 md:p-12`}
    >
      <Image
        className={`object-cover w-full md:w-1/2 aspect-[4/3]`}
        width={800}
        height={600}
        data={featured_image.reference.image}
      />
      <div className="flex flex-col items-start justify-center w-full gap-4 md:w-1/2">
        <h4 className="text-base font-bold uppercase">{heading.value}</h4>
        <h3 className="text-3xl font-bold">{tagline.value}</h3>
        <p className="text-base">{description.value}</p>
      </div>
    </div>
  );
}

const QUERY = gql`
  query product(
    $country: CountryCode
    $language: LanguageCode
    $handle: String!
  ) @inContext(country: $country, language: $language) {
    product: product(handle: $handle) {
      key_feature: metafield(namespace: "my_fields", key: "key_feature") {
        value
        reference {
          ... on Metaobject {
            heading: field(key: "heading") {
              value
            }
            tagline: field(key: "tagline") {
              value
            }
            description: field(key: "description") {
              value
            }
            featured_image: field(key: "featured_image") {
              reference {
                ... on MediaImage {
                  image {
                    url
                    width
                    height
                    altText
                  }
                }
              }
            }
          }
        }
      }
      compareAtPriceRange {
        maxVariantPrice {
          currencyCode
          amount
        }
        minVariantPrice {
          currencyCode
          amount
        }
      }
      description
      descriptionHtml
      featuredImage {
        url
        width
        height
        altText
      }
      handle
      id
      media(first: 6) {
        edges {
          node {
            ... on MediaImage {
              mediaContentType
              image {
                id
                url
                altText
                width
                height
              }
            }
            ... on Video {
              mediaContentType
              id
              previewImage {
                url
              }
              sources {
                mimeType
                url
              }
            }
            ... on ExternalVideo {
              mediaContentType
              id
              embedUrl
              host
            }
            ... on Model3d {
              mediaContentType
              id
              alt
              mediaContentType
              previewImage {
                url
              }
              sources {
                url
              }
            }
          }
        }
      }
      metafields(first: 20) {
        edges {
          node {
            id
            type
            namespace
            key
            value
            createdAt
            updatedAt
            description
            reference {
              __typename
              ... on MediaImage {
                id
                mediaContentType
                image {
                  id
                  url
                  altText
                  width
                  height
                }
              }
            }
          }
        }
      }
      priceRange {
        maxVariantPrice {
          currencyCode
          amount
        }
        minVariantPrice {
          currencyCode
          amount
        }
      }
      seo {
        description
        title
      }
      title
      variants(first: 250) {
        edges {
          node {
            availableForSale
            compareAtPriceV2 {
              amount
              currencyCode
            }
            id
            image {
              id
              url
              altText
              width
              height
            }
            metafields(first: 10) {
              edges {
                node {
                  id
                  type
                  namespace
                  key
                  value
                  createdAt
                  updatedAt
                  description
                  reference {
                    __typename
                    ... on MediaImage {
                      id
                      mediaContentType
                      image {
                        id
                        url
                        altText
                        width
                        height
                      }
                    }
                  }
                }
              }
            }
            priceV2 {
              amount
              currencyCode
            }
            selectedOptions {
              name
              value
            }
            sku
            title
            unitPrice {
              amount
              currencyCode
            }
            unitPriceMeasurement {
              measuredType
              quantityUnit
              quantityValue
              referenceUnit
              referenceValue
            }
          }
        }
      }
      vendor
    }
  }
`;
