import React, { useRef, useState } from 'react';
import { View, TouchableOpacity } from 'react-native';
import { ChatTeardropDots } from 'phosphor-react-native';
import BottomSheet from '@gorhom/bottom-sheet';
import { gestureHandlerRootHOC } from 'react-native-gesture-handler';
import { feedbackTypes } from '../../utils/feedbackTypes';
import { styles } from './styles';
import { theme } from '../../theme';
import { Options } from '../Options';
import { Form } from '../Form';
import { Success } from '../Success';

export type FeedbackType = keyof typeof feedbackTypes;

export function Widget() {

  const [feedbackType, setFeedbackType] = useState<FeedbackType | null>(null);
  const [feedbackSent, setFeedbackSent] = useState(false);

  const bottomSheetRef = useRef<BottomSheet>(null);

  function handleOpen() {
    bottomSheetRef.current?.expand();
  }

  function handleFeedbackSent() {
    setFeedbackSent(true);
  }

  function handleFeedbackTypeCancel() {
    setFeedbackType(null);
    setFeedbackSent(false);
  }

  return (
    <>
      <TouchableOpacity
        style={styles.button}
        onPress={handleOpen}
      >

        <ChatTeardropDots
          size={24}
          weight="bold"
          color={theme.colors.text_on_brand_color}

        />
      </TouchableOpacity>

      <BottomSheet
        ref={bottomSheetRef}
        snapPoints={[1, 280]}
        backgroundStyle={styles.modal}
        handleIndicatorStyle={styles.indicator}
      >

        {
          feedbackSent ?
            <Success 
            onSendAnotherFeedback={handleFeedbackTypeCancel}
            /> :
            <>
              {
                feedbackType ?
                  <Form
                    feedbackType={feedbackType}
                    onFeedbackCancel={handleFeedbackTypeCancel}
                    onFeedbackSent={handleFeedbackSent}
                  />
                  : 
                  <Options onFeedbackTypeChange={setFeedbackType} />
              }
            </>
        }
      </BottomSheet>

    </>
  );
}

export default gestureHandlerRootHOC(Widget);