import React, { Component } from 'react';
import { Share, View, Button } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';

class Shares extends Component {
    onShare = async () => {
        try {
            const result = await Share.share({
                message:
                    'Te invito a probar FakedIn con el siguiente link:https://expo.io/artifacts/d95bfaf3-4261-4192-bd95-ac4f58062e66',
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

    render() {
        return (
            <View style={{ marginTop: 70 }}>
                <ScrollView>
                    <Button onPress={this.onShare} title="Share" />
                </ScrollView>
            </View>
        );
    }
}

export default Shares;