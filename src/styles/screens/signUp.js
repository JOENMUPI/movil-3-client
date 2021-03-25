import { StyleSheet } from 'react-native';

export const signUpStyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "white",
        justifyContent: "center",
        paddingHorizontal: 30,
        paddingVertical: 100
    },

    title: {
        color: "#3465d9",
        fontWeight: "bold",
        fontSize: 30
    },

    subtitle: {
        color: "gray"
    },

    viewPass: {
        flexDirection: 'row'
    },

    section: {
        flexDirection: "row",
        borderColor: "gray",
        borderWidth: 1,
        borderRadius: 5,
        paddingHorizontal: 15,
        paddingVertical: 10,
        alignItems: "center",
        marginTop: 10
    },

    sectionForText: {
        paddingHorizontal: 15,
        paddingTop: 10,
    },

    textInput: {
        color: "gray",
        paddingLeft: 10
    },

    signIn: {
        width: "100%",
        height: 40,
        backgroundColor: "#3465d9",
        justifyContent: "center",
        alignItems: "center",
        marginTop: 25,
        borderRadius: 5
    },

    textSignIn: {
        color: "white",
        fontSize: 15,
        fontWeight: "bold",
    },

    signUp: {
        marginTop: 25,
        flexDirection: "row",
        justifyContent: "center"
    },

    textSignUp: {
        color: "#3465d9", 
        marginLeft: 3
    }
})