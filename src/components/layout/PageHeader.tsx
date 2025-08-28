import React from "react";
import { Paper, Card, Typography } from "@mui/material";

interface PageHeaderProps {
  title: string;
  subTitle: string;
  icon: React.ReactNode;
}

export default function PageHeader({ title, subTitle, icon }: PageHeaderProps) {

  return (
    <Paper elevation={0} square className="bg-gray-50">
      <div className="p-2 mb-2 flex">
        <Card className="bg-gray-300 p-2 inline-block">{icon}</Card>
        <div className="pl-4 opacity-10">
          <Typography variant="h6" component="div">
            {title} 
          </Typography>
          <Typography variant="subtitle2" component="div">
            {subTitle}
          </Typography>
        </div>
      </div>
    </Paper>
  );
}