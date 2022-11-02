import React from 'react'
import { SvgIconComponent } from "@mui/icons-material"
import Tooltip from '@mui/material/Tooltip';
import Badge from '@mui/material/Badge';
import Box from '@mui/material/Box';

interface IProps {
    icon : SvgIconComponent,
    tooltipTitle: string,
    badgeContent?: number,
    onClick?: (e ?: React.MouseEvent<HTMLDivElement, MouseEvent>) => void,
}

const NavbarMenuItem = ({icon: Icon, tooltipTitle, badgeContent, onClick} : IProps) => {

    if (badgeContent && badgeContent > 0) {
        return (
            <Tooltip title={tooltipTitle} arrow>
                <Badge badgeContent={badgeContent} color="error" max={99}>
                    <Box sx={{display: 'flex', alignItems: 'center', border: '2px solid #E2E8F0', width: '2rem', height: '2rem', borderRadius: '0.5rem', ':hover': {borderColor: '#CBD5E1', bgcolor: '#fafafa', cursor: 'pointer'}}} onClick={onClick}>
                        <Icon sx={{color: 'primary.main', flex: 1, fontSize: '1.25rem', lineHeight: '1.75rem'}}/>
                    </Box>
                </Badge>
            </Tooltip>
        )
    }

    return (
        <Tooltip title={tooltipTitle} arrow>
            <Box sx={{display: 'flex', alignItems: 'center', border: '2px solid #E2E8F0', width: '2rem', height: '2rem', borderRadius: '0.5rem', ':hover': {borderColor: '#CBD5E1', bgcolor: '#fafafa', cursor: 'pointer'}}} onClick={onClick}>
                <Icon sx={{color: 'primary.main', flex: 1, fontSize: '1.25rem', lineHeight: '1.75rem'}}/>
            </Box>
        </Tooltip>
    )
    
    

}

export default NavbarMenuItem