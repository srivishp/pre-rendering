function UserProfilePage(props) {
  return <h1>{props.username}</h1>;
}

export default UserProfilePage;

//! getServerSideProps and getStaticProps are mutually exclusive and should not be used together (in most cases)
//-> getServerSideProps runs for every incoming request
//* Executes on the server, after deployment
export async function getServerSideProps(context) {
  return {
    props: {
      username: "Anakin Skywalker",
    },
  };
}
