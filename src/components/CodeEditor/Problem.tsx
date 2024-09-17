import React from 'react';
import { Typography } from 'antd';

const { Title, Paragraph, Text } = Typography;

const Problem = () => {
  return (
    <div className="bg-card text-foreground h-full w-full p-6">
      <Title level={3} className="mb-4">
        1614. Maximum Nesting Depth of the Parentheses
      </Title>
      <Paragraph className="text-muted-foreground mb-4">
        Given a <Text strong>valid parentheses string</Text> <Text code>s</Text>, return the{' '}
        <Text strong>nesting depth</Text> of <Text code>s</Text>. The nesting depth is the <Text strong>maximum</Text>{' '}
        number of nested parentheses.
      </Paragraph>

      <Title level={4} className="mt-6">
        Example 1:
      </Title>
      <Paragraph className="mt-2">
        <Text strong>Input:</Text> <Text code>s = "(1+(2*3)+(8/4))+1"</Text>
      </Paragraph>
      <Paragraph className="mt-2">
        <Text strong>Output:</Text> 3
      </Paragraph>
      <Paragraph className="mt-2">
        <Text strong>Explanation:</Text> Digit 8 is inside of 3 nested parentheses in the string.
      </Paragraph>

      <Title level={4} className="mt-6">
        Example 2:
      </Title>
      <Paragraph className="mt-2">
        <Text strong>Input:</Text> <Text code>s = "(1)+(2)+(3)"</Text>
      </Paragraph>
      <Paragraph className="mt-2">
        <Text strong>Output:</Text> 1
      </Paragraph>
      <Paragraph className="mt-2">
        <Text strong>Explanation:</Text> Digit 3 is inside of 1 nested parentheses in the string.
      </Paragraph>

      <Title level={2} className="mt-6">
        Example 3:
      </Title>
      <Paragraph className="mt-2">
        <Text strong>Input:</Text> <Text code>s = "((1)+((2)))"</Text>
      </Paragraph>
      <Paragraph className="mt-2">
        <Text strong>Output:</Text> 3
      </Paragraph>
      <Paragraph className="mt-2">
        <Text strong>Explanation:</Text> Digit 2 is inside of 3 nested parentheses in the string.
      </Paragraph>
    </div>
  );
};

export default Problem;
