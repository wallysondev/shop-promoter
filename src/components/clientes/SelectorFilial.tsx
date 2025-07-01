import React from 'react';
import { View } from 'react-native';
import { Picker } from '@react-native-picker/picker';

type Props = {
  filial: string;
  setFilial: (value: string) => void;
};

export const SelectorFilial = ({ filial, setFilial }: Props) => {
  return (
    <View className="rounded-xl p-2">
      <Picker
        selectedValue={filial}
        onValueChange={(value) => setFilial(value)}
        style={{ color: filial ? '#000' : '#9CA3AF' }}
      >
        <Picker.Item label="OCE TORRES LTDA" value="2" />
      </Picker>
    </View>
  );
};
