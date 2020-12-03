import Logo from '../assets/logo_filled.png';

function Loading() {
    return (
        <div style={styles.container}>
            <img src={Logo} alt="Loading..."></img>
        </div>
    )
}

const styles = {
    container: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        margin: 50,
        height: '100vh'
    }
}

export default Loading;