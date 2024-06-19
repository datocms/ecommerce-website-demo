import { type FragmentType, getFragmentData } from '@/graphql/types';
import { TestimonialSectionFragmentDoc } from '@/graphql/types/graphql';
import ReactMarkdown from 'react-markdown';

type Props = {
  fragment: FragmentType<typeof TestimonialSectionFragmentDoc>;
};

const TestimonialsSection = ({ fragment }: Props) => {
  const { title, testimonial } = getFragmentData(
    TestimonialSectionFragmentDoc,
    fragment,
  );
  return (
    <div className="container mx-auto max-w-7xl px-16 py-12">
      <h2 className="font-display text-3xl font-semibold">{title}</h2>
      <div className="mt-12 grid grid-cols-1 gap-12 md:grid-cols-3 md:gap-24">
        {testimonial.map((testimonial) => {
          return (
            <div key={testimonial.id} className="relative">
              <div className="relative z-10 h-32 text-justify">
                <ReactMarkdown>{testimonial.testimonial || ''}</ReactMarkdown>
              </div>
              <div className="relative z-10 flex items-center justify-end text-sm">
                <svg
                  className="-mb-8 inline-block h-32 w-32"
                  x="0px"
                  y="0px"
                  viewBox="0 0 100 125"
                >
                  <title>Author</title>
                  <path d="M91.8 45c-3.9 0-5.9 2.3-7.7 4.3-1.7 2-3.2 3.7-6.2 3.7s-4.5-1.7-6.2-3.7C70 47.3 68 45 64 45c-3.9 0-5.9 2.3-7.7 4.3-1.7 2-3.2 3.7-6.2 3.7s-4.5-1.7-6.2-3.7c-1.8-2-3.8-4.3-7.7-4.3-3.9 0-5.9 2.3-7.7 4.3-1.7 2-3.2 3.7-6.2 3.7s-4.5-1.7-6.2-3.7c-1.8-2-3.8-4.3-7.7-4.3-.6 0-1 .4-1 1s.4 1 1 1c3 0 4.5 1.7 6.2 3.7 1.8 2 3.8 4.3 7.7 4.3 3.9 0 5.9-2.3 7.7-4.3 1.7-2 3.2-3.7 6.2-3.7s4.5 1.7 6.2 3.7c1.8 2 3.8 4.3 7.7 4.3 3.9 0 5.9-2.3 7.7-4.3 1.7-2 3.2-3.7 6.2-3.7s4.5 1.7 6.2 3.7c1.8 2 3.8 4.3 7.7 4.3 3.9 0 5.9-2.3 7.7-4.3 1.7-2 3.2-3.7 6.2-3.7.6 0 1-.4 1-1s-.4-1-1-1z" />
                </svg>
                <span>{testimonial.author}</span>
              </div>
              <svg
                className="absolute left-0 top-0 -ml-8 -mt-10 h-28 w-28 opacity-5"
                viewBox="0 0 95.333 95.332"
              >
                <title>Testimonial</title>
                <path
                  d="M30.512,43.939c-2.348-0.676-4.696-1.019-6.98-1.019c-3.527,0-6.47,0.806-8.752,1.793
                                            c2.2-8.054,7.485-21.951,18.013-23.516c0.975-0.145,1.774-0.85,2.04-1.799l2.301-8.23c0.194-0.696,0.079-1.441-0.318-2.045
                                            s-1.035-1.007-1.75-1.105c-0.777-0.106-1.569-0.16-2.354-0.16c-12.637,0-25.152,13.19-30.433,32.076
                                            c-3.1,11.08-4.009,27.738,3.627,38.223c4.273,5.867,10.507,9,18.529,9.313c0.033,0.001,0.065,0.002,0.098,0.002
                                            c9.898,0,18.675-6.666,21.345-16.209c1.595-5.705,0.874-11.688-2.032-16.851C40.971,49.307,36.236,45.586,30.512,43.939z"
                />
                <path
                  d="M92.471,54.413c-2.875-5.106-7.61-8.827-13.334-10.474c-2.348-0.676-4.696-1.019-6.979-1.019
                                            c-3.527,0-6.471,0.806-8.753,1.793c2.2-8.054,7.485-21.951,18.014-23.516c0.975-0.145,1.773-0.85,2.04-1.799l2.301-8.23
                                            c0.194-0.696,0.079-1.441-0.318-2.045c-0.396-0.604-1.034-1.007-1.75-1.105c-0.776-0.106-1.568-0.16-2.354-0.16
                                            c-12.637,0-25.152,13.19-30.434,32.076c-3.099,11.08-4.008,27.738,3.629,38.225c4.272,5.866,10.507,9,18.528,9.312
                                            c0.033,0.001,0.065,0.002,0.099,0.002c9.897,0,18.675-6.666,21.345-16.209C96.098,65.559,95.376,59.575,92.471,54.413z"
                />
              </svg>
            </div>
          );
        })}
      </div>
    </div>
  );
};
export default TestimonialsSection;
