import React, { useState } from 'react';
import { ArrowLeft } from 'phosphor-react-native';
import { View, TextInput, Image, Text, TouchableOpacity } from 'react-native';
import { theme } from '../../theme';
import { FeedbackType } from '../Widget';
import { feedbackTypes } from '../../utils/feedbackTypes';
import { captureScreen } from 'react-native-view-shot';
import * as FileSystem from 'expo-file-system';
import { styles } from './styles';
import { ScreenshotButton } from '../ScreenshotButton';
import { Button } from '../Button';
import { api } from '../../libs/api';

interface Props {
  feedbackType: FeedbackType;
  onFeedbackCancel: () => void;
  onFeedbackSent: () => void;
}

export function Form({ feedbackType,  onFeedbackCancel, onFeedbackSent}: Props) {

  
  const [isSendingFeedback, setIsSendingFeedback] = useState(false);
  const [screenshot, setScreenshot] = useState<string | null>(null);
  const [comment, setComment] = useState<string>('');


  const feedbackTypeInfo = feedbackTypes[feedbackType];

  function handleScreenshot() {
    captureScreen({
      format: 'png',
      quality: 0.8
    })
    .then(uri => setScreenshot(uri))
    .catch(error => console.log(error))
  }

  function handleScreenshotRemove() {
    setScreenshot(null);
  }

  async function handleSendFeedback() {
    if (isSendingFeedback) {
      return;
    }

    setIsSendingFeedback(true);

    const screenshotBase64 = screenshot && await FileSystem.readAsStringAsync(screenshot, {encoding: 'base64'});

    try {
      await api.post('feedbacks', {
        type: feedbackType,
        screenshot: `data:image/png;base64, ${screenshotBase64}`,
        comment
      });

      onFeedbackSent();

    }catch (err) {
      console.log(err);
      setIsSendingFeedback(false);
    }

  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onFeedbackCancel}>
          <ArrowLeft
            size={24}
            weight='bold'
            color={theme.colors.text_secondary}
          />
        </TouchableOpacity>

        <View style={styles.titleContainer}>

          <Image
            source={feedbackTypeInfo.image}
            style={styles.image}
          />

          <Text style={styles.titleText}>
            {feedbackTypeInfo.title}
          </Text>
        </View>
      </View>

      <TextInput
        multiline
        style={styles.input}
        placeholder="Algo não está funcionando bem? Queremos corrigir. Conte com detalhes o que está acontecendo"
        placeholderTextColor={theme.colors.text_secondary}
        autoCorrect={false}
        onChangeText={setComment}
      >
      </TextInput>

      <View style={styles.footer}>
        <ScreenshotButton
          onTakeShot={handleScreenshot}
          onRemoveShot={handleScreenshotRemove}
          screenshot={screenshot}
        />

        <Button 
        isLoading={isSendingFeedback} 
        onPress={handleSendFeedback}
        />
      </View>

    </View>
  );
}