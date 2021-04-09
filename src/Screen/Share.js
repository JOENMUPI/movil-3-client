import React from 'react';
import { Share, View, Button, Text, Alert } from 'react-native';

const InviteFriend = () => {
    const onShare = async () => {
        try {
            const result = await Share.share({
                message:
                    'Hello!. You have been invited to join the LinkedIn clone! ✔,' +
                    '\nDownload the application at this link: https://expo.io/artifacts/d95bfaf3-4261-4192-bd95-ac4f58062e66 '
            });
            if (result.action === Share.sharedAction) {
                if (result.activityType) {

                } else {

                }
            } else if (result.action === Share.dismissedAction) {

            }
        } catch (error) {
            alert(error.message);
        }
    };

   

    return (
        <View>
            <Text style={{
                marginTop: 40,
                fontSize: 25,
                textAlign: "center",
                color: "#000"
            }}>
                Obten mas conecciones!!
      </Text>
            <Text style={{
                marginHorizontal: 55,
                textAlign: "center",
                marginVertical: 5,
                opacity: 0.4,
                color: "#333"
            }}>
                Invita a tus amigos para aumentar tus conecciones, y asi mismo. Tus oportunidades de seguir creciendo
      </Text>
            <View style={{ marginTop: 40, width: "80%", alignSelf: "center" }}>
                <Button onPress={onShare} title="Share" />
            </View>

        </View>
    );
};

export default InviteFriend;
